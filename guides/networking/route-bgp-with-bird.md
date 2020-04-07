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

BGP isn't new, but having it be this accessible is! Leveraging dynamic hosting for a cluster of servers at a particular data center offers your workloads a safe, effective, and quick failover channel. In this guide, we'll walk you through configuring Local BGP using [BIRD](http://bird.network.cz/) so that you can broadcast a specific local IP address to a host of your choice.


### Getting Started

Enable BGP for the server in the portal via the server detail page, click ' **MANAGE**', then click ' **Enable**'

![enable-bgp-1](/images/route-bgp-with-bird/enable-bgp-1.png)
![enable-bgp-2](/images/route-bgp-with-bird/enable-bgp-2.png)

Next navigate over to **IPs & Networks** in your BGP enabled project and click on _Manage Block_ for the IPv4 block in the data center location that corresponds with your server deployment. Choose an available IP that will act as your broadcast IP. In this guide, we'll be using 10.99.200.138.

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

### Alternate Setup

You are able to automate the bird setup/configuration with the help of docker. Learn more [here](https://www.packet.com/resources/guides/bird/). 


#### Finishing Up

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

![server-details](/images/route-bgp-with-bird/server-details-new.png)

To test, you can ping the IP address in a command line - `ping 10.99.200.138`. _Remember, Local BGP is announcing a private IP address, so you'll have to be connected to the private network for the data center you're running Local BGP in. You can do that by SSHing into another server in that data center or by connected to [Doorman](https://www.packet.com/developers/docs/network/basic/doorman), Packet's private VPN._

**Congratulations! You've just configured a BGP routing protocol.**
