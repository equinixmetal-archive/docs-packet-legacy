<!--<meta>
{
    "title":"Elastic IPs",
    "description":"Setting Up & Using Elastic IPs",
    "tag":["Network", "Elastic IPs"]
}
</meta>-->

### Elastic IPs in Brief

If you request four elastic IPs from us, we will assign you a /30 which contains four IP addresses, e.g. 147.75.1.2/30.

You could then assign the entire block to a device, or assign a sub range within the assigned block (e.g. a /32 or /31). If you add the /30 block to a server, we will configure a single static route for 147.75.1.2/30 pointing to the management public IPv4 address of that server.

### Manage Subnets

In each project’s view, there is a tab titled “IP's & Networks” - this is the place to go to view and manage all IPs in that project, as well as to request additional elastic IP's:

From this view, you can select the IP subnet you wish to manage by clicking on “MANAGE BLOCK”, which brings you to a more detailed breakdown:

From there, you can select the specific IP you’re controlling, again clicking “MANAGE” to move forward. You can then select which server you’d like your IP address routed to, by selecting it from the “Target Server” pull-down menu. When you’re done, click on “Save” to make your changes permanent:

This will return you to the subnet screen, where you can see that your IP address is now in use:

Experiencing an outage and need to point your elastic IP at a different server? No problem, simply select “MANAGE” again, and select a new server to point it at. In a matter of seconds, the routing changes will propagate throughout the Packet network, and all traffic to your elastic IP will move to your new destination. You can also use this screen to “Unassign” your elastic IP, thus returning it your pool of available addresses.

Though this document focuses on our customer portal, customers are also able to migrate elastic IPs between servers using the Packet API as well

### Selecting Subnet size at Provisioning

Packet automatically offers a /31 subnet. However, if you are wanting to utilize VMs on a hypervisor that you may be installing you are welcome to choose a subnet of up to /28 to have ready when the provisioning process completes.

### Routing Subnet Block post provisioning

Having multiple subnet blocks, or a larger block from provisioning you can route them to your server by the following block sizes:

    /29  
    /30  
    /31  
    /32

### Host IP Configuration

It is important to note that, unlike management IPs, elastic IPs are not automatically configured on servers by default. This is by design; as a security measure, Packet does not maintain access to servers to update their network configuration files once they’re installed.

Using a sample IP address of 147.75.255.255, the following configuration will make the IP address usable on your server:

#### Ubuntu/Debian

To configure temporarily (won't come back up on reboot):

`sudo ip addr add 147.75.255.255 dev lo`

To make permanent, add to /etc/network/interfaces:

````
auto lo:0
iface lo:0 inet static
    address 147.75.255.255
    netmask 255.255.255.255
````

#### CentOS

To configure temporarily (won't come back up on reboot):

`sudo ip addr add 147.75.255.255 dev lo`

To make permanent, add to `/etc/sysconfig/network-scripts/ifcfg-lo:0`:

```
DEVICE="lo:0"
BOOTPROTO="static"
IPADDR=147.75.255.255
NETMASK=255.255.255.255
NETWORK=147.75.255.255
ONBOOT=yes
```

#### Container Linux by CoreOS

To configure temporarily (won't come back up on reboot):

`sudo ip addr add 147.75.255.255 dev lo`

To make permanent, add the new IP as well as your standard loopback to a new file in `/etc/systemd/network/10-loopback.network`

```
[Match]
Name=lo
[Network]
Address=127.0.0.1/24
Address=147.75.255.255/32
```

To ensure that your IP is setup correctly, you can use “ ip a ” to show all configured ip’s on a machine.

Before:

```
core@ip-test-coreos ~ $ ip -o a show dev lo
1: lo inet 127.0.0.1/8 scope host lo\ valid_lft forever preferred_lft forever
1: lo inet6 ::1/128 scope host \ valid_lft forever preferred_lft forever
```


#### Configuration:

````
core@ip-test-coreos ~ $ sudo ip addr add 147.75.255.255 dev lo
````

After:

```
core@ip-test-coreos ~ $ ip -o a show dev lo
1: lo inet 127.0.0.1/8 scope host lo\ valid_lft forever preferred_lft forever
1: lo inet 147.75.255.255/32 scope global lo\ valid_lft forever preferred_lft forever
1: lo inet6 ::1/128 scope host \ valid_lft forever preferred_lft forever
```

If all goes well, you'll be all set to start using your Elastic IP as you please. If you feel there is something missing in this tutorial or anything is unclear, give us a shout at support@packet.com.
