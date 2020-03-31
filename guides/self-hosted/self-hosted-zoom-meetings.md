<!-- <meta>
{
    "title": "Self-Hosted Zoom Meetings",
    "description":"How doe deploy Zoom Video Conferencing software on Packet",
    "tag": ["Self-Hosted", "Zoom"],
    "seo-title": "Self-Hosted Zoom Meetings - Packet Technical Guides",
    "seo-description": "Self-Hosted Zoom Meetings",
    "og-title": "Self-Hosted Zoom Meetings",
    "og-description":"Self-Hosted Zoom Meetings"   
}
</meta> -->

We're big fans of Zoom.us - it's one of the best online meeting services in terms of quality, features and price.  What we also love is the "self hosted" or "on premise" feature, which allows you to host Zoom on your servers.  

Why host Zoom on your own servers?   Well, the benefits are mainly around performance: instead of running in the shared Zoom.us cloud service with zillions of other users, you can host all your meetings on private infrastructure.  No noisy neighbors, lots of horsepower.  More importantly, if you're using a premium provider like Packet, you'll also get fantastic, top-tier bandwidth which immensely improves the meeting experience for everyone.

In this guide, we'll walk you through how to implement [Zoom's Meeting Connector](https://support.zoom.us/hc/en-us/sections/200305473-Meeting-Connector) (which is the application that runs  Zoom) on a pair of low cost Packet servers.  Note: the Meeting Connector still leverages Zoom's portal to run stuff like user management, meeting schedules, etc so this is just about installing the meeting software. 

## Getting Started

First, you'll you need to have a Business or Education account with Zoom.us, and you'll need to subscribe for over 10 Pro hosts. Once that's ready, navigate to "Enable Meeting Connector" on your [admin page](https://zoom.us/account/hybrid). Enabling the meeting connector allows you to leverage the on-premise, super fast, and private hosted version of Zoom!

We chose to run the meeting connector on two of our smallest instances - the $.05/hr [Tiny But Mighty](https://www.packet.net/cloud/servers/t1-small/) - with both servers running Ubuntu 16.04.   Why two?  Well, Zoom allows two Meeting Connectors - in the event one fails, the other takes over seamlessly:

> "Each MMR process supports up to 350 concurrent meeting participants at the same time. That is, if you deploy one Controller VM, your Meeting Connector supports 350 concurrent participants. If you deploy another Controller VM for HA, your total capacity increases to 700."

Links to the Zoom Meeting Connector configuration files can be found in the Zoom portal. 

## Implementation

The next step is to setup a virtualized environment.  To manage the virtual machines we went with [VirtualBox](https://www.virtualbox.org/).

#### **1**  . Update the apt sources list with a mirror for the VirtualBox download.

```bash
echo "deb http://download.virtualbox.org/virtualbox/debian xenial contrib" >> /etc/apt/sources.list
```

#### **2**  . Download some packages along with VirtualBox.

* _**dkms (Dynamic Kernel Module Support)**_ is "designed to create a framework where kernel dependant module source can reside so that it is very easy to rebuild modules as you upgrade kernels."
* _**unzip**_ lets you extract files from a ZIP archive.
* _**wget**_ is a non-interactive web file downloader.
* _**bridge-utils**_ allows you to manage bridge networks. We will need to create a bridge network for the Zoom Meeting Connector virtual machine.
* _**linux-headers-4.8.0-32-lowlatency**_ is needed to load the VirtualBox kernel module. The kernel gets downloaded with the VirtualBox download.

```bash
apt-get install build-essential dkms unzip wget bridge-utils linux-headers-4.8.0-32-lowlatency virtualbox-5.1
```

#### **3**  . Download and install the VirtualBox extension pack.

```bash
cd /tmp

wget http://download.virtualbox.org/virtualbox/5.1.0/
Oracle_VM_VirtualBox_Extension_Pack-5.1.0-108711.vbox-extpack

VBoxManage extpack install Oracle_VM_VirtualBox_Extension_Pack-5.1.0-108711.vbox-extpack
```

#### **4**  . Reboot the machine.

The kernel installed by VirtualBox needs to boot up; at the time of this writing, that's [linux-image-4.8.0-32-lowlatency](http://packages.ubuntu.com/xenial/kernel/linux-image-4.8.0-32-lowlatency). 

#### **5**  . When you're back up and running, build the VirtualBox kernel modules and start the VirtualBox services.

```bash
sudo /sbin/vboxconfig
```

#### **6**  . Setup the network.

```bash
# This virtual loopback interface is a workaround to avoid the bridge not being available on reboot.

echo "auto lo:0
iface lo:0 inet manual" >> /etc/network/interfaces
```

```bash
# We're using a Packet assigned elastic IP address here that'll act as the gateway router for our virtual machine.
# You'll need 2 elastic IPs in total, one for the gateway and one for the virtual machine.

echo "auto vmbr0
iface vmbr0 inet static
address 147.75.192.212
netmask 255.255.255.254
bridge_ports lo:0
bridge_stp off" >> /etc/network/interfaces
```

```bash
# Bring up the new interface.

ifup vmbr0
```

```bash
# Need to uncomment this line inside sysctl.conf to enable packet forwarding for IPv4.

sed -i "/net.ipv4.ip_forward=1/ s/# *//" /etc/sysctl.conf
```

#### **7**  . Download the OVM and VMDK files from Zoom and add them to VirtualBox.

```bash

cd /tmp

wget http://hybridupdate.zoom.us/latest/controller/Zoomus_Control_vapp_OVF09.ovf
wget http://hybridupdate.zoom.us/latest/controller/system.vmdk

# Add the downloaded configurations.
VBoxManage import Zoomus_Control_vapp_OVF09.ovf

# Add our bridge network to the Zoom Meeting Connector VM and enable the graphical interface.
# We'll need to access the virtual machine and configure it's network.

VBoxManage modifyvm "Zoom Meeting Connector-Controller" --bridgeadapter1 vmbr0
VBoxManage modifyvm "Zoom Meeting Connector-Controller" --vrde on
```

#### **8**  . Configure the Zoom Meeting Connector-Controller so that it starts automatically in the event of a reboot.

```bash

echo "VBOXAUTOSTART_DB=/etc/vbox
VBOXAUTOSTART_CONFIG=/etc/vbox/vbox.cfg" >> /etc/default/virtualbox

echo "default_policy = allow" >> /etc/vbox/vbox.cfg

chgrp vboxusers /etc/vbox
chmod 1775 /etc/vbox

VBoxManage setproperty autostartdbpath /etc/vbox
VBoxManage modifyvm "Zoom Meeting Connector-Controller" --autostart-enabled on
VBoxManage modifyvm "Zoom Meeting Connector-Controller" --autostart-delay 30
```

#### **9**  . Start the Zoom Meeting Connector-Controller! : )

```bash
VBoxManage startvm "Zoom Meeting Connector-Controller" --type headless
```

#### **10**  . Configure the Virtual Machine's networking interface.

We used [Microsoft Remote Desktop](https://itunes.apple.com/us/app/microsoft-remote-desktop/id715768417?mt=12) for MacOS. To log in use your machine's IP along with the port Zoom Meeting Connector-Controller was running on, in this case, that's 3389. You can check the port by running VBoxManage `showvminfo`.

#### **11**  . Remove ifcfg-eth0:0...

```bash
rm -f /etc/sysconfig/network-scripts/ifcfg-eth0:0
```

#### **12**  . Edit ifcfg-eth0.

IPADDR is the second IP mentioned in the comments above. The first IP was used to configure our bridge network to function as the gateway. The machine runs CentOS so the most convenient option is to use the default editor, vi.

```bash
vi /etc/sysconfig/network-scripts/ifcfg-eth0
```

```bash
DEVICE=eth0
BOOTPROTO=none
ONBOOT=yes
TYPE=ethernet
DNS=8.8.8.8
IPV6INIT=no
IPADDR=147.75.192.211
NETMASK=255.255.255.254
GATEWAY=147.75.192.212
BROADCAST=147.75.192.211
```

#### **13**  . Restart the network.

```bash
service network restart
```

#### **14**  . Reboot the host machine.

# Finishing Up

To finalize the installation navigate to the machine at port 5480 over https and follow [these steps](https://support.zoom.us/hc/en-us/sections/200305473-Meeting-Connector). Additionally, you can and should configure your firewall to allow the necessary connections from Zoom. You can find that information on Zoom [here](https://support.zoom.us/hc/en-us/articles/202342006-Network-Firewall-Settings-for-Meeting-Connector). 

## Starting Meetings On Zoom's Meeting Connector

The host of a meeting needs to be set to **Type** _Corp_ to take advantage of all your hard work and the newly configured Zoom Meeting Connector. Navigate to the [user management section](https://zoom.us/account/user) on Zoom, check the user you'd like to change and click on _Type_ under **Change**to update a user to _Corp._

And that's it! Now, all of your Zoom conference audio and video data is accepted and distributed on Packet hardware.

![success](/images/self-hosted-zoom-meetings/success.png)
