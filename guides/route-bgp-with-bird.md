<!--
<meta>
{
    "title":"Route BGP with BIRD",
    "description":"Route BGP with BIRD on Packet",
    "author":"Zalkar Ziiaidin",
    "github":"zalkar-z",
    "email":"zak@packet.com",
    "tag":["Route BGP", "BIRD"]
}
</meta>
-->

Route BGP with BIRD

# Demo

# Introduction

BGP isn't new, but having it be this accessible is! Leveraging dynamic hosting for a cluster of servers at a particular data center offers your workloads a safe, effective, and quick failover channel. In this guide, we'll walk you through configuring Local BGP using [BIRD](http://bird.network.cz/) so that you can broadcast a specific local IP address to a host of your choice.

# Getting Started

If you haven't already requested that BGP be added to your account you'll need to get that sorted before continuing with this guide - see more info about getting started [here](https://www.packet.net/developers/guides/route-bgp-with-bird/).

For this guide, we're deploying a [Tiny But Mighty](https://www.packet.net/cloud/servers/t1-small/) server with Ubuntu 16, and [BIRD](https://bird.network.cz/) to broadcast a local IP with BGP.

# Step 1 - Choose an IP to Broadcast

Navigate over to **IPs & Networks** in your BGP enabled project and click on _Manage Block_ for the IPv4 block in the data center location that corresponds with your server deployment. Choose an available IP that will act as your broadcast IP. In this guide, we'll be using 10.99.12.138.

![manage-ips](/images/route-bgp-with-bird/manage-ips.png)

![manage-ips-2](/images/route-bgp-with-bird/manage-ips-2.png)

# Step 2 - Update Network Interface

Update the network interfaces with a virtual loopback interface.

```bash

  echo 'auto lo:0
  iface lo:0 inet static
  address 10.99.12.138
  netmask 255.255.255.255' >> /etc/network/interfaces
```

# Step 3 - Bring Up the Interface

```bash
ifup lo:0
```

# Step 4 - Installing BIRD

[BIRD](http://bird.network.cz/) is an open source implementation for routing Internet Protocol packets on Unix-like operating systems. 

```bash
apt-get install bird
```

# Step 5 - Configure IP Forwarding, _optional_

If you'll be using this server as a gateway/proxy and performing NAT to other internal devices, you need to allow IPv4 forwarding:

**For IPv4:**

```bash
sysctl net.ipv4.ip_forward=1
```

# Step 6 - Edit the BIRD Configuration File

First, backup the original file.

```bash
mv /etc/bird/bird.conf /etc/bird/bird.conf.original
```
Now edit your bird.conf file to looks like the below.

```bash
vim /etc/bird/bird.conf
```

```default

filter packetdns {
  # IPs to announce ( 10.99.12.138 in this case)
  # Doesn't have to be /32. Can be lower
  if net = 10.99.12.138/32 then accept;
}

# your (Private) bond0 IP
router id 10.99.69.9;

protocol direct {
  interface "lo"; # Restrict network interfaces BIRD works with
}

protocol kernel {
  persist; # Don't remove routes on bird shutdown
  scan time 20; # Scan kernel routing table every 20 seconds
  import all; # Default is import all
  export all; # Default is export none
}

# This pseudo-protocol watches all interface up/down events.
protocol device {
  scan time 10; # Scan interfaces every 10 seconds
}

# Your default gateway IP below here, in this case that's 10.99.69.8
protocol bgp {
  export filter packetdns;
  local as 65000;
  neighbor 10.99.69.8 as 65530;
}
```

Note: You'll probably want to automate a setup like this using [user data](https://support.packet.com/kb/articles/user-data). That way you can provision your servers and configure their network without ever having to SSH into the server! To do that, you would curl the metadata service and parse the response using something like [jq](https://stedolan.github.io/jq/download/). For example:

```bash
json=$(curl https://metadata.packet.net/metadata)
router=$(echo $json | jq -r ".network.addresses[] | select(.public == false) | .address")
gateway=$(echo $json | jq -r ".network.addresses[] | select(.public == false) | .gateway")
```

_Note that we're specifically looking for the servers private addresses._

# Step 7 - Restart BIRD

```bash
service bird restart
```

# Step 8 - Enable BGP

Enable BGP for the server in the portal via the server detail page.

![enable-bgp](/images/route-bgp-with-bird/enable-bgp.png)

# Finishing Up

If you log into your server via SSH you can check the status of your BIRD daemon by accessing the bird console with the `birdc` command. In the BIRD console execute `show protocols all bgp1`

If the peering was successful you'll see this:

```default

bird> show protocols all bgp1
name proto table state since info
bgp1 BGP master up 18:06:06 Established
 Preference: 100
 Input filter: ACCEPT
 Output filter: packetdns
 Routes: 0 imported, 1 exported, 0 preferred
 Route change stats: received rejected filtered ignored accepted
Import updates: 0 0 0 0 0
Import withdraws: 0 0 --- 0 0
Export updates: 1 0 0 --- 1
Export withdraws: 0 --- --- --- 0
 BGP state: Established
Neighbor address: 10.99.69.8
Neighbor AS: 65530
Neighbor ID: 192.80.8.235
Neighbor caps: refresh restart-aware AS4
Session: external AS4
Source address: 10.99.69.9
Hold timer: 85/90
Keepalive timer: 26/30
```

As you can see, the BGP state is Established and we are exporting 1 route.

If you check the server detail page, you will also see the learned route.

![server-details](/images/route-bgp-with-bird/server-details.png)

To test, you can ping the IP address in a command line - `ping 10.99.12.138`. _Remember, Local BGP is announcing a private IP address, so you'll have to be connected to the private network for the data center you're running Local BGP in. You can do that by SSHing into another server in that data center or by connected to [Doorman](https://www.packet.net/developers/guides/route-bgp-with-bird/), Packet's private VPN._

**Congratulations! You've just configured a BGP routing protocol.**
