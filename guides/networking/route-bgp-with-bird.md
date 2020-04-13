<!-- <meta>
{
    "title":"Route BGP with BIRD",
    "description":"Configuring BGP Announcer BIRD for Local BGP Access",
    "tag":["Route BGP", "BIRD"],
    "seo-title": "Route BGP with BIRD - Packet Technical Guides",
    "seo-description": "Route BGP with BIRD on Packet",
    "og-title": "Route BGP with BIRD",
    "og-description":"Route BGP with BIRD on Packet"  
}
</meta> -->

Bird is an open source routing daemon for Unix-like systems. It can be used to establish bgp sessions between client instances and the packet network.

An elastic IP address can simply be announced via Bird from the instance that is currently using it, thereby making it easy to freely move the IP from one instance to another within the same project.

### Getting Started

If you haven't already requested that BGP be added to your account you'll need to get that sorted before continuing with this guide - see more info about getting started [here](https://www.packet.com/developers/docs/network/advanced/local-and-global-bgp).

### Choose an IP to Broadcast

Navigate over to **IPs & Networks** in your BGP enabled project and click on _Manage Block_ for the IPv4 block in the data center location that corresponds with your server deployment. Choose an available IP that will act as your broadcast IP. In this guide, we'll be using 10.99.200.138.

![manage-ips](/images/route-bgp-with-bird/manage-ips-new.png)
![manage-ips-2](/images/route-bgp-with-bird/manage-ips-2-new.png)

### Update Network Interface

Update the network interfaces with a virtual loopback interface.

```bash

  echo 'auto lo:0
  iface lo:0 inet static
  address 10.99.200.138
  netmask 255.255.255.255' >> /etc/network/interfaces
```

### Bring Up the Interface

```bash
ifup lo:0
```

### Configuration

#### Method 1: Bird on Baremetal

First install system dependencies. On Ubuntu 18.04 this looks like:

```bash
apt -y update && apt -y install python3.6 python3-pip git bird
```

Now clone the repo and install remaining python dependencies:

```bash
cd /opt
git clone https://github.com/packethost/network-helpers.git
cd network-helpers
pip3 install -e .
```

Now use the `configure.py` script to configure bird:

```
./configure.py -r bird | tee /etc/bird/bird.conf
filter packet_bgp {
  # the IP range(s) to announce via BGP from this machine
  # these IP addresses need to be bound to the lo interface
  # to be reachable; the default behavior is to accept all
  # prefixes bound to interface lo
  # if net = A.B.C.D/32 then accept;
  accept;
}

router id 10.99.182.129;

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

protocol bgp neighbor_v4_1 {
  export filter packet_bgp;
  local as 65000;
  neighbor 10.99.182.128 as 65530;
  password "somepassword";
}
```

Check that the config looks correct, then restart bird:

```bash
systemctl restart bird
```

And verify:

```bash
birdc
```
```
bird> show protocols all neighbor_v4_1
name     proto    table    state  since       info
neighbor_v4_1 BGP      master   up     15:20:31    Established   
  Preference:     100
  Input filter:   ACCEPT
  Output filter:  packet_bgp
  Routes:         0 imported, 1 exported, 0 preferred
  Route change stats:     received   rejected   filtered    ignored   accepted
    Import updates:              0          0          0          0          0
    Import withdraws:            0          0        ---          0          0
    Export updates:              1          0          0        ---          1
    Export withdraws:            0        ---        ---        ---          0
  BGP state:          Established
    Neighbor address: 10.99.182.128
    Neighbor AS:      65530
    Neighbor ID:      147.75.36.73
    Neighbor caps:    refresh restart-aware AS4
    Session:          external AS4
    Source address:   10.99.182.129
    Hold timer:       66/90
    Keepalive timer:  18/30
```

In this case we only have a single elastic IP bound to interface lo, and we see the prefix is being exported and accepted so we are done.

**Note:** Bird uses separate daemons for IPv4 and IPv6 routing. To configure bgp over IPv6 using bird, the process will be the same as above, except that the configuration command you will use will be:

```bash
./configure.py -r bird6 | tee /etc/bird/bird6.conf
```

Then:

```bash
systemctl restart bird6
```

#### Method 2: Bird via Docker

Using your OS's package management utility, install docker, docker-compose and git if not already installed. On Ubuntu 18.04 this looks like:

```bash
apt -y update && apt -y install docker docker-compose git
systemctl enable docker && systemctl start docker
```

Clone Packet's network-helpers repo:

```bash
cd /opt
git clone https://github.com/packethost/network-helpers.git
```

Build the image:

```bash
cd network-helpers
docker build -f routers/bird/Dockerfile -t local/bird:latest .
```

Up the container:

```bash
cd routers/bird
docker-compose up -d
```

To verify that the bird service was started cleanly and correctly, we can view the container logs:

```
docker logs $(docker ps | awk '$2 == "local/bird:latest" {print $1}')
+ /opt/bgp/configure.py -r bird
+ tee /etc/bird/bird.conf
filter packet_bgp {
  ### the IP range(s) to announce via BGP from this machine
  ### these IP addresses need to be bound to the lo interface
  ### to be reachable; the default behavior is to accept all
  ### prefixes bound to interface lo
  ### if net = A.B.C.D/32 then accept;
  accept;
}

router id 10.99.182.129;

protocol direct {
  interface "lo"; ### Restrict network interfaces BIRD works with
}

protocol kernel {
  persist; ### Don't remove routes on bird shutdown
  scan time 20; ### Scan kernel routing table every 20 seconds
  import all; ### Default is import all
  export all; ### Default is export none
}

### This pseudo-protocol watches all interface up/down events.
protocol device {
  scan time 10; ### Scan interfaces every 10 seconds
}

protocol bgp neighbor_v4_1 {
  export filter packet_bgp;
  local as 65000;
  neighbor 10.99.182.128 as 65530;
  password "somepassword";
}
+ '[' 0 == 0 ']'
+ echo
+ cat
+ supervisord -c /opt/bgp/routers/bird/supervisord.conf
2020-04-09 13:44:27,263 WARN For [program:bird], AUTO logging used for stderr_logfile without rollover, set maxbytes > 0 to avoid filling up filesystem unintentionally
2020-04-09 13:44:27,263 INFO Set uid to user 0 succeeded
2020-04-09 13:44:27,265 INFO supervisord started with pid 12
2020-04-09 13:44:28,270 INFO spawned: 'bird' with pid 16
2020-04-09 13:44:29,274 INFO success: bird entered RUNNING state, process has stayed up for > than 1 seconds (startsecs)
```

And verify:

```bash
docker exec -it $(docker ps | awk '$2 == "local/bird:latest" {print $1}') birdc
```
```
bird> show protocols all neighbor_v4_1
name     proto    table    state  since       info
neighbor_v4_1 BGP      master   up     16:10:27    Established   
  Preference:     100
  Input filter:   ACCEPT
  Output filter:  packet_bgp
  Routes:         0 imported, 1 exported, 0 preferred
  Route change stats:     received   rejected   filtered    ignored   accepted
    Import updates:              0          0          0          0          0
    Import withdraws:            0          0        ---          0          0
    Export updates:              1          0          0        ---          1
    Export withdraws:            0        ---        ---        ---          0
  BGP state:          Established
    Neighbor address: 10.99.182.128
    Neighbor AS:      65530
    Neighbor ID:      147.75.36.73
    Neighbor caps:    refresh restart-aware llgr-aware AS4
    Session:          external AS4
    Source address:   10.99.182.129
    Hold timer:       59/90
    Keepalive timer:  20/30
```

**Note:** If you have bpg enabled over both ipv4 and ipv6 on your server, there will be separate running instances of the bird daemon for each protocol. Thus to verify an ipv6 peering session, in the above command you would use `birdc6` instead of `birdc`.

In this case we only have a single elastic IP bound to interface lo, and we see the prefix is being exported and accepted so we are done.

To test, you can ping the IP address in a command line - `ping 10.99.200.138`. _Remember, Local BGP is announcing a private IP address, so you'll have to be connected to the private network for the data center you're running Local BGP in. You can do that by SSHing into another server in that data center or by connected to [Doorman](https://www.packet.com/developers/docs/network/basic/doorman), Packet's private VPN._

**Congratulations! You've just configured a BGP routing protocol.**
