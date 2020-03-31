<!-- <meta>
{
    "title":"KVM and Libvirt on Ubuntu 16.04",
    "description":"Installing and configurating KVM with Libvirt on Ubuntu 16.04",
    "tag":["virtual machines"],
    "seo-title": "KVM and Libvirt on Ubuntu 16.04 - Packet Technical Guides",
    "seo-description": "KVM and Libvirt on Ubuntu 16.04 description",
    "og-title": "KVM and Libvirt on Ubuntu 16.04",
    "og-description": "KVM and Libvirt on Ubuntu 16.04 description"   
}
</meta> -->

### Introduction

Turns out booting virtual machines from scratch using the [KVM](http://www.linux-kvm.org/page/Main_Page) [hypervisor](https://en.wikipedia.org/wiki/Hypervisor) with the virtualization manager [Libvirt](https://libvirt.org/) has some gotchas! We'll dispel any of that with this guide. We'll also show you how to expose your virtual machine to the public internet with an elastic IP.

All of Packet's hardware can be virtualized but for this guide, we'll be deploying a [Tiny But Mighty](https://www.packet.net/cloud/servers/t1-small/) server with Ubuntu 16.04 installed.

_**Note: This installation is completed entirely using the command line (no GUI!). Also, you will need a public /30 IPv4 block assigned to your account if you plan to route public traffic to your virtual machine. You can request the [IP block](https://www.packet.com/developers/docs/network/basic/elastic-ips) from our portal.**_

### Step 1: Install Virtualization Software

Once you're SSH'd into your server as **root** you'll need to install several packages to create and properly manage virtual machines.

*   **_qemu-kvm_**: the hypervisor and emulator.
*   **_virtinst_**: a suite of command line tools for installing and managing virtual machines with the operating system of your choosing.
*   **_bridge-utils_**: used to create and manage bridge networks.

Good idea to do this...
```
apt-get update && apt-get upgrade -y    
```
Then install the packages...
```
apt-get install bridge-utils qemu-kvm virtinst -y    
```
Once you're done you can verify the install is successful by running `kvm-ok`.

**Restart your server so that the needed kvm and libvirt deamons come up.**

### Step 2: Configure the Network

When configuring the network for your virtual machines you can choose to run in [NAT](https://en.wikipedia.org/wiki/Network_address_translation) mode or in Route mode. 

In NAT mode, each virtual machine gets a private IP and communicates with the public internet via the host's public IP. 

In Route mode, each virtual machine gets their own public IP. 

With either configuration, you'll need to create a bridge network. By default, libvirt comes with a preconfigured NATed network. It will usually assign 192.168.x.x IPs to the virtual machines you create. But we're not doing that here! We want our virtual machines to have their own public IPs so we will define our own network in an XML file.

Go ahead and assign all the IPs to the server that you're on.

![ips](/images/kvm-and-libvirt/attach-elastic-IP-subnet.png)

We'll be using the _[net-define](https://libvirt.org/sources/virshcmdref/html/sect-net-define.html)_ command to configure the virtual machine.

The configuration needs to be in XML; for this example, we're creating a .xml file called _network.xml_ in our root directory. The order in which we add our IPs matters! So have a look at the screenshot above to see which IP goes where in the configuration.

For subnets of size `/30` or greater, there are 3 IPs that cannot be used for your VMs, the network address (first IP), the gateway (this is the host bridge), and the broadcast address (last IP). So if we were using the subnet `139.178.66.144/29` which has 8 total IPs, the IP allocation would be as follows.

139.178.66.144     - Network address

139.178.66.145     - Gateway for the VMs / Host bridge address

139.178.66.146-150 - Range of usable IPs for VMs

139.178.66.151     - Broadcast address


Run the following command to create the `network.xml` file. You will need to adjust the IPs and subnet mask for this to fit your subnet.

```
echo '<network>
	<name>vmbr0</name>
	<forward mode="route"/>
	<bridge name="vmbr0" stp="on" delay="0"/>
	<ip address="139.178.66.145" netmask="255.255.255.248">
		<dhcp>
			<range start="139.178.66.146" end="139.178.66.150"/>
		</dhcp>
	</ip>
</network>' >> network.xml
```


The following commands will define, create, and start our new network.

```
virsh net-define /root/network.xml
virsh net-autostart vmbr0
virsh net-start vmbr0
```

These next commands will delete the default private network, this is not required but you can if you prefer to delete it.

```
virsh net-destroy default
virsh net-undefine default
```

Lastly, restart the _libvirt-bin_ daemon.

```
service libvirt-bin restart    
```

Now if you look at your interfaces you'll see a new interface named vmbr0 with our 139.178.66.145/297 IP.

Lastly, don't forget to enable IPv4 and IPv6 packet forwarding!

```
sed -i "/net.ipv4.ip_forward=1/ s/# *//" /etc/sysctl.conf
sed -i "/net.ipv6.conf.all.forwarding=1/ s/# *//" /etc/sysctl.conf
```

Reload sysctl for the packet forwarding changes to be applied.

```
sysctl -p
```

### Step 3: Install a Virtual Guest Machine

To install a virtual machine we'll run _[virt-install](https://www.mankier.com/1/virt-install)_. Feel free to configure some of those parameters such as the RAM amount, vCPUs, OS, etc.. The following will install an Ubuntu 16.04 Xenial VM.

```
virt-install --name ubuntu16 \
--ram 4096 \
--disk path=/var/lib/libvirt/images/ubuntu16.img,size=8 \
--vcpus 2 \
--os-type linux \
--os-variant ubuntu16.04 \
--network bridge=vmbr0 \
--graphics none \
--console pty,target_type=serial \
--location 'http://us.archive.ubuntu.com/ubuntu/dists/xenial/main/installer-amd64/' \
--extra-args 'console=ttyS0,115200n8 serial'
```

The Ubuntu installer will hijack your console at some point soon after running the command and guide you through the rest of the install. You will be prompted to create a user which you will need to remember the credentials for in order to access the VM later.

The important part comes up during the end of the install where you'll be prompted with the option of installing additional software. We will need to install the OpenSSH Server package in order to access the VM once the installation is completed.

```
                                [!] Software selection

        At the moment, only the core of the system is installed. To tune the
        system to your needs, you can choose to install one or more of the
        following predefined collections of software.

        Choose software to install:

                       [ ] Manual package selection
                       [ ] Ubuntu Cloud Image (instance)
                       [ ] DNS server
                       [ ] Edubuntu desktop
                       [ ] Kubuntu desktop
                       [ ] Kubuntu full
                       [ ] LAMP server
                       [ ] Lubuntu minimal installation
                       [ ] Lubuntu Desktop
```

**Very important** that you scroll all the way down using your arrow keys and select "OpenSSH Server" using the space bar before continuing. That's how we'll access the VM once it's up.

### Step 5: Access Your VM

To access your VM you can SSH into it from the host machine.

But where is the IP address!?!? 

Easy, first get the virtual machine's MAC address: (ubuntu16 is the name of the VM)

```
virsh domiflist ubuntu16
```

Next, find the IP address:

```
arp -an | grep "the MAC address"    
```

Then, SSH into the VM with the user name of the account that we created during the OS installation process:

```   
ssh username@the-ip-address;
```

### Conclusion

There you have it, KVM and Libvirt demystified! If you have any suggestions about this guide please leave a comment below.
