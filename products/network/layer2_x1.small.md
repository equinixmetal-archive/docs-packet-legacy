Our Layer 2 feature on the x1.small (which is found in our 11 custom locations) has some differences in both scope and implementation when compared to our other supported machines (m1.xlarge, c1.xlarge, and s1.large).



### #1 - Enable Layer 2 Feature for your Project

  

In order to use Layer 2 on your x1.small, or any other server, you’ll need to enable Layer 2 networking for your project via our portal.  You can find this in the "IPs and Networks" tab.  
  
Once enabled, under "Virtual Networks" you can add one or more networks like this:

![](https://deskpro-cloud.s3.amazonaws.com/files/26944/47/46218APQWHMWZMCBWHSN0-1539907054068.png)

  

Note that networks are local to a specific data center and that the assigned VLAN ID displayed here will be used to configure server port switching and server network setup.  
  
When you add a network, we immediately implement the configs in our switches - however, in order for it to be made available to each of your servers, you need to take one additional steps: navigate to each server's network configuration page, to add the VNID on the second interface.

![](https://deskpro-cloud.s3.amazonaws.com/files/26944/47/46220MCHZMKYSTJYDQPR0-1539907056396.png)

  

---

### #2 - Server Configuration

  

Since the x1.small only utilizes a single NIC, the only configuration supported on this server is the following:

Leave eth0 in bond0 and add a single VLAN to eth1.  
  

![](https://deskpro-cloud.s3.amazonaws.com/files/26944/47/46219CQSBXPMHJMBPMQN0-1539907054777.png)

  

In this example, where we configure a VLAN on the second interface in order to be able to ping between the hosts, you will need at least two servers in the same project, and a single Virtual Network.    
  
You will still be able to connect to the server via its public IPv4/IPv6 addresses that are visible in the portal/API because we are leaving eth0 and bond0 intact.  
  
From your host OS, use the following instructions depending on your operating system:

  

### **CentOS:**  
Configure `/etc/sysconfig/network-scripts/ifcfg-eno2`  on each server, changing the `IPADDR`field to the desired IP and network. Ensure the IP addresses are different on each host, but belong to the same network.

DEVICE=eno2
ONBOOT=yes
IPADDR=192.168.1.1
NETMASK=255.255.255.0
NETWORK=192.168.1.0
BOOTPROTO=none

  

Bring up the interface:`sudo ifup eno2`

  

### **Ubuntu:**

  

Configure `/etc/network/interfaces`  on each server, changing the IP address to the desired IP from your chosen block

auto eno2
iface eno2 inet static
    address 192.168.10.1
    netmask 255.255.255.0

  

Bring up the interface:`sudo ifup eno2` 

  

Communication should now be possible between hosts via virtual Layer 2 Network: 

````
root@layer2:~# ping 192.168.10.1
PING 192.168.10.1 (192.168.10.1) 56(84) bytes of data.
64 bytes from 192.168.10.1: icmp\_seq=1 ttl=64 time=0.361 ms
64 bytes from 192.168.10.1: icmp\_seq=2 ttl=64 time=0.338 ms
64 bytes from 192.168.10.1: icmp\_seq=3 ttl=64 time=0.333 ms
^C
--- 192.168.10.1 ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2033ms
rtt min/avg/max/mdev = 0.333/0.344/0.361/0.012 ms
````
  

*Please Note*: It is not recommended to use the subnet starting with 10.x.x.x as we use this for server's private networking and collisions could occur if you used the same private addressing as was configured on your host.