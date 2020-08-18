<!-- <meta>
{
   "title":"KVM and Libvirt on Ubuntu 20.04",
    "description":"Installing and configurating KVM with Libvirt on Ubuntu 20.04",
    "tag":["virtual machines"],
    "seo-title": "KVM and Libvirt on Ubuntu 20.04 - Packet Technical Guides",
    "seo-description": "KVM and Libvirt on Ubuntu 20.04 description",
    "og-title": "Virtualize your infrastructure on Packet.",
    "og-description": "In this technical guide explore how to setup and configure KVM hypervisor & Libvirt on automated bare metal."
}
</meta> -->

### Introduction

Turns out booting virtual machines from scratch using the [KVM](http://www.linux-kvm.org/page/Main_Page) [hypervisor](https://en.wikipedia.org/wiki/Hypervisor) with the virtualization manager [Libvirt](https://libvirt.org/) has some gotchas! We'll dispel any of that with this guide. We'll also show you how to expose your virtual machine to the public internet with an elastic IP.

All of Packet's hardware can be virtualized but for this guide, we'll be deploying an [Entry Level & All-Arounder](https://www.packet.com/cloud/servers/c3-small/) server with Ubuntu 20.04 installed.

_**Note: This installation is completed entirely using the command line (no GUI!). Also, you will need a public /29 IPv4 block assigned to your account if you plan to route public traffic to your virtual machine. You can request the [IP block](https://www.packet.com/developers/docs/network/basic/elastic-ips) from our portal.**_

### Step 1: Deploy The Server & Install Virtualization Software

Once you're logged into your Packet Dashboard navigate to deploy a new c3.small.x86 server in the region that suits you best. Do not add the /29 IPv4 block to the server at this point, we will assign it later on. The server will automatically be assigned one public IPv4 and one public IPv6 address which we'll use as the management addresses for the KVM host itself. The elastic IPs are entire reserved for the virtualization layer.


Once you're SSH'd into your server as **root** you'll need to install several packages to create and properly manage virtual machines.

*   **_qemu-kvm_**: the hypervisor and emulator.
*   **_virtinst_**: a suite of command line tools for installing and managing virtual machines with the operating system of your choosing.
*   **_bridge-utils_**: used to create and manage bridge networks.
*   **_libvirt_**: The system daemon managing your VMs for you

Good idea to do this...
```
$ apt update && apt upgrade -y
```

Then install the packages...
```
$ apt install bridge-utils qemu-kvm virtinst libvirt-daemon virt-manager -y
```

Once you're done you can verify the install is successful by running `kvm-ok`.
```
$ kvm-ok
```

### Step 2: Configure the Network

When configuring the network for your virtual machines you can choose to run in [NAT](https://en.wikipedia.org/wiki/Network_address_translation) mode or in Route mode. 

In NAT mode, each virtual machine gets a private IP and communicates with the public internet via the host's public IP. 

In Route mode, each virtual machine gets their own public IP. 

With either configuration, you'll need to create a bridge network. By default, libvirt comes with a preconfigured NATed network. It will usually assign 192.168.x.x IPs to the virtual machines you create. But we're not doing that here! We want our virtual machines to have their own public IPs so we will define our own network in an XML file.

In your Packet dashboard click on your KVM's host name, select `Network` on the left hand menu and then select the `+ Assign New Elastic` button on the right.

![ips](/images/kvm-and-libvirt/attach-elastic-IP-subnet.png)

We'll be using the _[net-define](https://libvirt.org/sources/virshcmdref/html/sect-net-define.html)_ command to configure the virtual machine.

The configuration needs to be in XML; for this example, we're creating a .xml file called _network.xml_ in our root directory. The order in which we add our IPs matters! So have a look at the screenshot above to see which IP goes where in the configuration.

For subnets of size `/30` or greater, there are 3 IPs that cannot be used for your VMs, the network address (first IP), the gateway (this is the host bridge), and the broadcast address (last IP). So if we were using the subnet `139.178.66.144/29` which has 8 total IPs, the IP allocation would be as follows.

139.178.66.144     - Network address

139.178.66.145     - Gateway for the VMs / KVM host bridge address

139.178.66.146-150 - Range of usable IPs for VMs (5 in the case of a /29)

139.178.66.151     - Broadcast address


Run the following command to create the `network.xml` file. You will need to adjust the IPs and subnet mask for this to fit your subnet.
A IPv4 netmask cheat sheet can be found [here](https://www.aelius.com/njh/subnet_sheet.html). The first IP you'll have to alter in the XML file is the one for KVM host which will act as a virtual network gateway for your VMs. If it ends in an even number like it does in our example the KVM host gateway address has to be odd, if it ends in an odd number it has to be an even number. In our case it's the latter case since the network ends in `.144`. Therefore our KVM host gateway address has to be `139.178.66.145`.

The other two IP addresses to change are the ones defining the useable IP space in our network. In this case we'll have 5 useable IP addresses which we can assign to our VMs. The broadcast address does not need to set explicitly.

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

Lastly, restart the _libvirt daemon_.

```
systemctl restart libvirtd.service
```

Now if you look at your interfaces you'll see a new interface named vmbr0 with our 139.178.66.145/29 IP.

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

To install a virtual machine we'll run _[virt-install](https://www.mankier.com/1/virt-install)_. Feel free to configure some of those parameters such as the RAM amount, vCPUs, OS, etc.. The following will install an Ubuntu 18.04 Bionic VM.

```
virt-install --name ubuntu18 \
--ram 4096 \
--disk path=/var/lib/libvirt/images/ubuntu18.img,size=8 \
--vcpus 2 \
--os-type linux \
--os-variant ubuntu18.04 \
--network bridge=vmbr0 \
--graphics none \
--console pty,target_type=serial \
--location 'http://us.archive.ubuntu.com/ubuntu/dists/bionic/main/installer-amd64/' \
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

To view the IP address/MAC address of your VM have virsh list the DHCP leases for the virtual bridge network we setup: (ubuntu18 is the name of the VM)

```
virsh net-dhcp-leases vmbr0
```

Then, SSH into the VM with the user name of the account that we created during the OS installation process:

```
ssh username@the-ip-address;
```

### Conclusion

There you have it, KVM and Libvirt demystified! If you have any suggestions about this guide please leave a comment below.
