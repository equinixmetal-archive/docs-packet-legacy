<!--
<meta>
{
    "title":"Layer 2 on x1.small",
    "description":"How to configure layer 2 on x1.small",
    "author":"Zak",
    "github":"zalkar-z",
    "date": "2019/10/25",
    "email":"zak@packet.com",
    "tag":["layer 2", "networking", "advanced", "x1.small"]
}
</meta>
-->

Our Layer 2 feature on the x1.small (which is found in our 11 custom locations) has some differences in both scope and implementation when compared to our other supported machines.

## 1 - Create a VLAN in your Packet Project

The x1.small will need at least one Ethernet port connected to a VLAN network for layer 2
connectivity. VLANs can be created via the "IPs and Networks" tab in your Packet project,
and under "Layer 2".

![create-vlan](/images/layer-2-on-x1.small/create_vlan.jpg)

Unlike our other layer 2 supporting server types, the x1.small is provisioned in hybrid
networking mode by default. This means one of the server's ethernet interfaces has been
removed from bond0 on our switch and is ready to be attached to a VLAN network. This
networking mode cannot be changed on the x1.small server type.

![hybrid_mode](/images/layer-2-on-x1.small/hybrid_mode.jpg)

At the bottom of the server's "Networking" page, you will see an option to add a VLAN. Note: VLANs are facility-specific, so make sure your VLAN and your server are in the same facility, or you will not be able to add it to the server's Ethernet port.

![add_a_vlan](/images/layer-2-on-x1.small/add_a_vlan.jpg)
![add_a_vlan_2](/images/layer-2-on-x1.small/add_a_vlan_2.jpg)


## 2 - Server Configuration

Since the x1.small only utilizes a single NIC, the only configuration supported on this server
is the following:

Leave eth0 in bond0 and add a single VLAN to eth1.

![server-config](/images/layer-2-on-x1.small/server-config.png)

In this example, where we configure a VLAN on the second interface in order to be able to ping between the hosts, you will need at least two servers in the same project, and a single Virtual Network.  

You will still be able to connect to the server via its public IPv4/IPv6 addresses that are visible in the portal/API because we are leaving eth0 and bond0 intact.

From your host OS, use the following instructions depending on your operating system:

## CentOS:

Configure `/etc/sysconfig/network-scripts/ifcfg-eno2`  on each server, changing the `IPADDR`  field to the desired IP and network. Ensure the IP addresses are different on each host, but belong to the same network.

```
DEVICE=eno2
ONBOOT=yes
IPADDR=192.168.1.1
NETMASK=255.255.255.0
NETWORK=192.168.1.0
BOOTPROTO=none
```

Bring up the interface: `sudo ifup eno2 `.

## Ubuntu:

Configure `/etc/network/interfaces`  on each server, changing the IP address to the desired IP from your chosen block

```
auto eno
iface eno2 inet static
address 192.168.10.
netmask 255.255.255.
```

Bring up the interface: `sudo ifup eno2 `.

Communication should now be possible between hosts via virtual Layer 2 Network:

```
root@layer2:~# ping 192.168.10.
PING 192.168.10.1 (192.168.10.1) 56(84) bytes of data.
64 bytes from 192.168.10.1: icmp_seq=1 ttl=64 time=0.361 ms
64 bytes from 192.168.10.1: icmp_seq=2 ttl=64 time=0.338 ms
64 bytes from 192.168.10.1: icmp_seq=3 ttl=64 time=0.333 ms
^C
--- 192.168.10.1 ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2033ms
rtt min/avg/max/mdev = 0.333/0.344/0.361/0.012 ms
```

Please Note: It is not recommended to use the subnet starting with 10.x.x.x as we use this for server's private networking and collisions could occur if you used the same private addressing as was configured on your host.