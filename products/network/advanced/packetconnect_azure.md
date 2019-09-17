

Packet Connect is a low latency, a highly reliable direct connection from Packet to other networks and cloud providers. This Layer 2 service is built from the ground up to be a cloud-native network service focused on developers and their needs. The service is fully automated via native APIs to create virtual connections at configurable speeds from 100 Mbps to 10 Gbps.

The Packet Connect service is currently offered at EWR1 and SJC1 data centers, with plans to support additional Packet facilities in the near future. Packet Connect currently supports Microsoft Azure ExpressRoute, with GCP Interconnect, Direct Connect, and many others coming soon. Physical cross-connects in our Packet Connect markets are also supported.

### Converting Network Type to Mixed/Hybrid Mode

After initial provisioning, Packet servers are set up in a Layer 3 network configuration. To allow Packet Connect to function, the network configuration on the servers need to be converted from Layer 3 to Mixed/Hybrid or Layer 2 mode. For this example, we will use Mixed/Hybrid mode and place the second interface in the VLAN attached to the Packet Connect circuit. This can be found under the ‘Network’ tab on the device view page for any configuration that supports Layer 2.

![Network Type](/images/packet-connect-azure/network-type.png)

### Removing ‘eth1’ from ‘bond0’

With the device now converted to Mixed/Hybrid mode, this allows the second interface to be utilized for Layer 2 connectivity. In the Packet API and portal, the second interface is referred to as eth1; however, in the device itself, the second network interface will be determined based on the specific chassis, motherboard, kernel, and operating system. To determine what the interface names are, you can run this command:

`cat /sys/class/net/bond0/bonding/slaves`


This command should return two interface names, for example:

`enp0s20f0 enp0s20f1`

For this example, we'll use enp0s20f1 as the second interface name, but you should replace enp0s20f1 with the correct interface name on your device.

To complete this configuration change to support Layer 2, the second interface needs to be removed from bond0 on the running OS as well as on reboot. To remove from the running OS:

`echo "-enp0s20f1" > /sys/class/net/bond0/bonding/slaves`

After you have done this, make it permanent by editing the /etc/network/interfaces file on Debian-based systems and /etc/sysconfig/network-scripts/ifcfg-enp0s20f1 on rpm-based systems. Examples of such configurations can be found here. 
Assigning a static IP address

After you have removed the second interface from the bond and made it permanent, you need to add a static IP address to the interface. The IP address assigned here is of your own choosing, but there are important things to note:

* It must be a /30 subnet

* It must fall within the RFC1918 private networking ranges and not within the Packet-assigned 10.x range for your project.

* From the /30 subnet, you will assign the first IP to the second interface on your device and use it with the BGP session

* From the /30 subnet, Azure will use the second IP and this will be your BGP neighbor on the Azure side.

ℹ️ **Please Note:** Once you have established the BGP session with Azure, you can announce additional networks across this session. You are not limited to the /30 - it is simply used to establish the BGP session. We will use the 10.1.1.0/30 range for this example. This is important, as this needs to match what is configured in Azure. There are 2 usable IPs in the /30 subnet: 10.1.1.1 - your IP, and what Azure peers with using BGP over L2 & 10.1.1.2 - the BGP neighbor on Azure's side.

We will configure 10.1.1.1. On deb-based systems, find the second interface reference and change it to reflect the IP address you wish to use:

 ```
 auto enp0s20f1
- iface enp0s20f1 inet manual
-    pre-up sleep 4
-    bond-master bond0
+ iface enp0s20f1 inet static  
+    address 10.1.1.1
+    netmask 255.255.255.252
```
On rpm-based systems, modify to add the IP address:

```
DEVICE=enp0s20f1
ONBOOT=yes
HWADDR=00:00:00:00:00:00
+ IPADDR=10.1.1.1
+ NETMASK=255.255.255.252
BOOTPROTO=none
```

 With the second interface configured with a static IP address, turn down and up the second interface:

```
ifdown enp0s20f1
ifup enp0s20f1
````

### Create a VLAN

To connect your Packet device to Azure via Packet Connect, a VLAN must be allocated. This can be done by clicking IPs & Networking > Layer 2 from the customer portal. When creating VLAN, you must choose the facility where your device resides.

![Create VLAN](/images/packet-connect-azure/create-vlan.png)


### Attach VLAN to the device

After the VLAN has been allocated, connect the VLAN to the device on the second interface - in the UI this will show as eth1. This is done from the device view > Network > Layer 2.

![Attach VLAN](/images/packet-connect-azure/attach-vlan.png)

### Install Bird (BGP speaker) on your device

It is not necessary for BGP to be enabled on your project, as your BGP speaker will be peering with a neighbor that Azure has set up across the Layer 2 VLAN assigned to the device, not to Packet's switching infrastructure. Routes announced across this VLAN is what allows for communication between Packet and Azure. 

To install bird on debian-based system, simply:

`apt-get install bird`

For rpm-based systems, first setup the bird repo:

```
cat >> /etc/yum.repos.d/bird.repo <<EOF
[bird]
name=Network.CZ Repository
baseurl=ftp://repo.network.cz/pub/bird/centos/7/x86_64/
enabled=1
gpgcheck=0
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-network.cz
EOF
```
After this, install bird:

`yum install -y bird`

With bird installed, it’s always wise to back up the original configuration in case there are issues:

`mv /etc/bird/bird.conf /etc/bird/bird.conf.bak`

After you have done this, create the new configuration file. There are several important details here.

1) The range within filter packet_bgp is the CIDR range(s) that you wish to announce to Azure.

2) Notice that your route id is your IP 10.1.1.1 from the /30 and that you are peering with 10.1.1.2 (the second IP from the original /30 subnet). Example of this bird configuration for bird here.

With bird configured, start the service. On deb-based systems:

`service bird start`

rpm-based systems:

`systemctl start bird`

To double check the service is up and doing the needful you can issue show protocols all bgp1 from birdc the following is an example of the output you should see:

![Network Type](/images/packet-connect-azure/bird-config.png)

`birdc show protocols all bgp1 `


The message ‘No route to host’ is expected, until we complete the next series of steps in completing the Azure connection.

## Azure Portal Setup

### Virtual Network & Gateway Subnet

Provide a name you wish to call this virtual network. The address CIDR must be a /16, for example, 192.168.0.0/16. For the subnet address range, the CIDR must be /24 for example 192.168.1.0/24. Once, the “Virtual Network” is created, it will show up under “Virtual Networks” with the address range 192.168.0.0/16. 

ℹ️**Please note:** the location in the Azure portal will say US-EAST (EWR1) and US-WEST (SJC1)

![](/images/packet-connect-azure/virtual-network-gateway-subnet.png)

Then create a “Gateway Subnet” for this Virtual network. Select your virtual network, then under Subnets, select “Gateway Subnet”. It will have a default name, the CIDR must be /26, for example, 192.168.200.0/26.

![](/images/packet-connect-azure/virtual-network-gateway-subnet-2.png)

Assuming you have not yet created a VM, the virtual network gets automatically linked to your VM, or your VM is now part of that virtual network which has a CIDR range, Subnet and Gateway Subnet. The VM will have a public IP that you can ssh into and a private IP address in the range "192.168.1.0/24” that you had set as the subnet range while creating the virtual network.

#### Virtual Network Gateway

When creating the Virtual network gateway please keep in mind, it can take ~20 minutes to deploy. Also, do opt for ExpressRoute & not VPN when creating your Virtual Network Gateway. Select your virtual-network, and then select “Create new” for Public IP and enter the name you would like the gateway to have.

![](/images/packet-connect-azure/virtual-network-gateway.png)

#### Create Azure Express Circuit

ℹ️**Please Note:** Peering location would either be New York (EWR1) or Silicon Valley (SJC1). Also, for bandwidth the lowest we peer with Azure is 100Mbps. As far as Location, it would be (US) East for EWR1 & (US) West for SJC1.
With the express circuit created, you will want to go ahead copy & retain the service key. As this will be a requirement to complete the Packet Connect <-> Azure setup from within the Packet Portal: IPs & Networking > PacketConnect: 

![](/images/packet-connect-azure/azure-express-circuit-config.png)

![](/images/packet-connect-azure/packet-connect-portal.png)

With the Expressroute Circuit created & provisioned, next up Private Peering:

![](/images/packet-connect-azure/private-peering.png)

The Peer ASN is Packet’s ASN 65530. This needs to match the bird configuration.

The Primary Subnet needs to be the same /30 subnet configured on the second interface and configured in bird, in this example: 10.1.1.0/30.

For the VLAN, Azure always uses vlan_id “2” as outer tag to connect to your Packet Connect VLAN in Packet.
Connect your Express Route Circuit to your Virtual Network Gateway by selecting your ExpressRoute, then click on “Connections”, then “Add”, it should show your Virtual Network: 

![](/images/packet-connect-azure/add-connection.png)

And finally, verify the connection between Packet <-> Azure has been learned by checking bird:

![](/images/packet-connect-azure/bird-verify.png)

You can now add IP addresses to your device in Packet:

`ip a add 192.168.100.1/24 dev lo`

The routes will be announced to Azure, and you can connect/ping your private IP from your VM on Azure to and from your devices on Packet.

Want to setup Packet Connect and Azure with Terraform? Awesome! Check it out here.
