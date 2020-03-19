<!-- <meta>
{
    "title": "Layer 2 Configurations",
    "description": "Setting up Private Networking with Layer2 configuration",
    "tag": ["layer 2", "networking", "advanced"],
    "seo-title": "Layer 2 Configurations - Packet Technical Guides",
    "seo-description": "How to configure some possible layer 2 environments.",
    "og-title": "Layer 2 Configurations",
    "og-description":" How to configure some possible layer 2 environments."
}
</meta> -->

Private networking environments are different on Packet compared to other cloud providers. There are essentially two ways of achieving private connectivity between different hosts on Packet.

The first method is by utilizing the private IPv4 space (10.x.x.x) that is assigned and configured in each server instance on the same project by default so you don't have to do any additional configuation. If you need cross datacenter private connectivity, you can enable Backend Transfer but be aware that you will be charged for bandwidth traffic at a reduced rate of $0.03 / GB.

The second method which we will be covering in this guide is by utilizing Packet's Layer 2 VLAN feature which lets you create more traditional private / hybrid networking environments. The Layer 2 feature lets you provision between one and twelve (per project) project-specific layer 2 networks (VLANs). However, this option does not offer the ability to have private cross datacenter connections. For more details about the basics of this feature, please read our [overview article](https://www.packet.com/developers/docs/network/advanced/layer-2).


## Bonding on Packet
Before we get to the nitty gritty details of the guide, it's important to understand the [networking configuration](https://www.packet.com/developers/docs/network/overview) of Packet servers. By default, each server has two networking interfaces that are setup in an LACP (mode 4) bond that is configured both in the Host OS and on the switch.  

![bonding](/images/layer-2-configurations/bonding.png)

Packet allows users to change the networking mode of each server from the default Layer 3 Bonded mode to either Hybrid or Layer 2 networking. In Hybrid mode, the first interface is left in the LACP bond but the second interface is separated from the bond so that you can attach VLANs to it. In Layer 2 mode, you can either have both interface in a bonded configuration or you can have both interfaces separated so that you can attach different VLANs to each interface.


## Common Use Cases

The following are different scenarios that we will be covering in this guide:

* Hybrid mode: Leaving the first interface in the bond and adding a single VLAN to the second interface.
* Hybrid mode: Leaving the first interface in the bond and adding (trunking) multiple VLANs to the second interface.
* Hybrid and pure L2: A cluster of private hosts in layer 2 mode and using a single node in hybrid mode as an internet gateway.  


**Please Note:** For the purpose of this guide, we are using eth0/eth1 to represent the first and second interfaces. The actual interface name will depend on what operating system and server configuration you are using.

## Configuration #1: Leaving eth0 in bond0 and adding a single VLAN to eth1.

In this example, you will need at least 2 servers in the same project and at least 1 Virtual Network (VLAN). We will be removing eth1 from bond0, attaching a VLAN to it, and pinging between the hosts.

**Note:** this is the only layer 2 configuration available on the x1.small.x86 server type.

You will still be able to connect to the server via its public IPv4/IPv6 addresses that are visible in the portal/API because we are leaving eth0 and bond0 intact.  

![hybrid configuration](/images/layer-2-configurations/config-1.png)

1. From the portal, browse to both servers' networking overview pages, click "Convert To Other Network Type" and choose "mixed/hybrid."  

    ![convert network type](/images/layer-2-configurations/convert-network-type.png)  

2. From the networking page for both servers click "Add New Vlan", and choose eth1 as the interface and select the Virtual Network ID (VNID, or VLAN ID) you wish to use. The VNIDs must be the same for both servers for intra-host communication to work.  

    ![add VLAN](/images/layer-2-configurations/add-vlan.png)  

3.  From your Host OS, follow the steps below, depending on your operating system:

#### CentOS:

make sure eth1 has been removed from `bond0`

`cat /sys/class/net/bond0/bonding/slaves`

If not, remove it:

`echo "-eth1" > /sys/class/net/bond0/bonding/slaves`

Bring down the eth1 interface:

`sudo ifdown eth1`


Configure `/etc/sysconfig/network-scripts/ifcfg-eth1` on each server, changing the IPADDR field to the desired IP and network. Ensure the IP addresses are different on each host, but belong to the same network.

```
DEVICE=eth1
ONBOOT=yes
HWADDR=e4:1d:2d:11:22:33
IPADDR=192.168.1.2
NETMASK=255.255.255.0
NETWORK=192.168.1.0
BOOTPROTO=none
```

Bring up the interface:  
`sudo ifup eth1`

#### Ubuntu / Debian

make sure eth1 has been removed from `bond0`

`cat /sys/class/net/bond0/bonding/slaves`

If not, remove it:

`echo "-eth1" > /sys/class/net/bond0/bonding/slaves`

Bring down the eth1 interface:

`sudo ifdown eth1`

Configure /etc/network/interfaces on each server, changing the IP address to the desired IP from your chosen block:

```
auto eth1
iface eth1 inet static
    address 192.168.1.2
    netmask 255.255.255.0
```

Bring up the interface:  
`sudo ifup eth1`

You should now be able to communicate between hosts via your virtual Layer 2 network:

```
root@layer2:~# ping -I eth1 192.168.1.2
PING 192.168.1.3 (192.168.1.3) from 192.168.1.4 eth1: 56(84) bytes of data.
64 bytes from 192.168.1.3: icmp\_seq=1 ttl=64 time=0.106 ms
64 bytes from 192.168.1.3: icmp\_seq=2 ttl=64 time=0.110 ms
64 bytes from 192.168.1.3: icmp\_seq=3 ttl=64 time=0.115 ms
^C
--- 192.168.1.3 ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2000ms
rtt min/avg/max/mdev = 0.106/0.110/0.115/0.009 ms
```

**Please Note:** It is not recommended to use the subnet starting with 10.x.x.x as we use this for the server's private networking and collisions could occur if you used the same private addressing as was configured on your host.

## Configuration #2: Leaving eth0 in bond0 and adding multiple VLANs to eth1

In this case, we will be keeping the same configuration for eth0, except we will be assigning a second VLAN to eth1.

![multiple VLANs](/images/layer-2-configurations/config-2.png)

In this scenario, IP packets that arrive at the host will have the VLAN ID populated. You will need to setup two interfaces that will receive packets destined for each VLAN.

#### CentOS

Install the prerequisites for VLANs:

```
sudo modprobe 8021q
sudo echo "8021q" >> /etc/modules
```

bring down eth1:

`ifdown eth1`

Configure `/etc/sysconfig/network-scripts/ifcfg-eth1.1000` and Configure `/etc/sysconfig/network-scripts/ifcfg-eth1.1001` on your server. 1000 and 1001 should match the VLANs you've configured on the host in the portal/API.

```
DEVICE=eth1.1000
BOOTPROTO=none
ONBOOT=yes
IPADDR=192.168.1.2
PREFIX=24
NETWORK=192.168.1.0
VLAN=yes
```

Restart networking, or `ifup eth1.1000 and eth1.1001`

```
sudo ifup eth1.1000
sudo ifup eth1.1001
```

#### Ubuntu

Install the prerequisites for VLANs:

```
sudo apt-get install vlan
sudo modprobe 8021q
sudo echo "8021q" >> /etc/modules
```

Bring down eth1:

`ifdown eth1`

**Note:** if you don't want eth1 to come up after a reboot be sure to comment out the eth1 configuration in your /etc/network/interfaces file.

Add the new interface to /etc/network/interfaces, changing 1000 to match the VLAN IDs:

```
auto eth1.1000
iface eth1.1000 inet static
    address 192.168.100.1
    netmask 255.255.255.0
    vlan-raw-device eth1

auto eth1.1001
iface eth1.1001 inet static
    address 172.16.100.1
    netmask 255.255.255.0
    vlan-raw-device eth1
```

Restart networking, or `ifup eth1.1000 and eth1.1001`

```
sudo ifup eth1.1000
sudo ifup eth1.1001
```

## Configuration #3: Combined hybrid and layer 2 modes

![pure layer 2](/images/layer-2-configurations/config-3.png)
![hybrid network mode](/images/layer-2-configurations/config-1.png)

For this configuration you'll need two nodes, one in hybrid and one in layer 2 networking mode, and one VLAN (although you could change it to use more, as in configuration 2).

1. Attach the VLAN to the hybrid node's eth1 interface, as shown below.

2. Repeat this step with the same VLAN for the isolated node. Remember, this node is in pure layer 2 networking mode, and bond0 is dismantled.
Keep in mind that disabling bonding will remove public connectivity from your server and you will have to use [SOS](https://support.packet.com/kb/articles/sos-serial-over-ssh) to connect.

  If you get locked out, you can always change the networking mode back to layer 3--or hybrid mode--and SSH back in via the public IPv4 address.  

3. While connected to SOS, edit the network interfaces file and remove all but the eth1 interface, which should be configured with it's own private IP from whichever block you choose to use (e.g. 192.168.2.0/24). You'll also need to specify the gateway address as the hybrid node's eth1 IP address.

#### CentOS

Tear down the bond0 interface:

`sudo ifdown bond0`

Configure `/etc/sysconfig/network-scripts/ifcfg-eth1` with any free IP from the IPv4 private block used by eth1 on the hybrid node. Ensure that the netmask, network, and gateway details are correct:

```
DEVICE=eth1
ONBOOT=yes
HWADDR=e4:1d:2d:11:22:32
IPADDR=192.168.2.2
NETMASK=255.255.255.0
GATEWAY=192.168.2.1
NETWORK=192.168.2.0
BOOTPROTO=none
```

Bring up eth1:

`sudo ifup eth1`

You can set the "ONBOOT" parameter for the rest of the network interfaces to "no" so they do not come up one reboots. bond0 will not be used, and eth0 will only be used if you choose to connect it to another VLAN (perhaps connected to other isolated node). In which case, it should be configured with it's own IP accordingly

#### Ubuntu

Tear down the bond0 interface:

`sudo ifdown bond0`

Configure `/etc/network/interfaces` with any free IP from the IPv4 private  block used by eth1 on the hybrid node. Ensure that the netmask, network, and gateway details are correct:

```
auto eth1
iface eth1 inet static
    address 192.168.2.2
    netmask 255.255.255.0
    gateway 192.168.2.1
```

Bring up eth1:

`sudo ifup eth1`

You can remove the other interfaces from this file. Bond0 will not be used, but if you connect eth0 to another VLAN (perhaps connected to other isolated nodes) then configure it with it's own IP, accordingly.

At this point your hybrid and isolated node can talk to each other, but the isolated node cannot reach the internet. To give the isolated node internet access you must configure IP masquerading on the hybrid node.

First, make sure IP forwarding is enabled on the hybrid node.

`sysctl net.ipv4.ip_forward=1`

Now add a new IP masquerade rule to the NAT table with iptables. We want this to route traffic from any of our private IPs through the internet facing network interface, in this case, bond0.

`iptables -t nat -A POSTROUTING -s 192.168.2.0/24 -o bond0 -j MASQUERADE`

Now your isolated node should be able to ping outside the network.

```
ping 8.8.8.8  
PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.  
64 bytes from 8.8.8.8: icmp\_seq=1 ttl=120 time=1.85 ms  
64 bytes from 8.8.8.8: icmp\_seq=2 ttl=120 time=1.93 ms  
64 bytes from 8.8.8.8: icmp\_seq=3 ttl=120 time=1.87 ms  
64 bytes from 8.8.8.8: icmp\_seq=4 ttl=120 time=1.86 ms  
64 bytes from 8.8.8.8: icmp\_seq=5 ttl=120 time=1.81 ms
```

Congratulations! You've now deployed private / hybrid networking environments successfully on Packet.
