<!-- <meta>
{
    "title":"OpenStack DevStack",
    "description":"With some technical skills, DevStack is a great option to test OpenStack on a bare metal device",
    "tag":["DevStack", "OpenStack"],
    "seo-title": "NVMe Flash Drives - Packet Technical Guides",
    "seo-description": "OpenStack DevStack - Packet Technical Guides",
    "og-title": "Bring up a complete OpenStack environment.",
    "og-description":"Using DevStack, learn how to quickly deploy OpenStack on fully automated infrastructure."
}
</meta> -->

With some technical skills, [DevStack](https://docs.openstack.org/devstack/latest/) is a great option to install and test OpenStack on your laptop or on a Packet Server. DevStack is ideal for users who want to see what the Dashboard looks like from an admin or user perspective, and OpenStack contributors wanting to test against a complete local environment.

By default DevStack is run with all the services as systemd unit files. Systemd is now the default init system for nearly every Linux distro, and systemd encodes and solves many of the problems related to poorly running processes.

The reason why DevStack cannot be used for production purposes, is because after a reboot, it is almost impossible to bring it up on the last known good state. 

DevStack attempts to support Ubuntu 16.04/17.04, Fedora 24/25, CentOS/RHEL 7, as well as Debian and OpenSUSE.  Packet supports any of these operating systems by default. 

If you do not have a preference, Ubuntu 16.04 is the most tested, and will probably go the smoothest.

**Warning:** DevStack will make substantial changes to your system during installation. Only run DevStack on servers that are dedicated testing purposes.

### Getting Started

For this guide, I will be using the official [DevStack](https://docs.openstack.org/devstack/latest/guides/single-machine.html) documentation, but we will do some modifications on the local.conf file.

I have deployed a Type1 server with a [custom /29](https://www.packet.com/developers/docs/network/basic/standard-ips) subnet running Ubuntu 16.04.

You should specify the larger custom subnet so that you can give Public IPs to some test VMs, making them easily reach them from the public internet.

### IP Address Usage

We have requested 8 total IPs from Packet during provisioning.  Here is how the 8 IPs will be used on the custom /29 subnet:

147.75.x.0 - Network address
147.75.x.1 - Gateway
147.75.x.2 - Host IP
147.75.x.3 - .6 - Usable IPs for VMs
147.75.x.7 - Broadcast

If you need more IPs, you can choose to go with a /28 subnet.

Once the server is provisioned, please run the following command to ensure your system is fully up to date:
```
apt-get update && apt-get upgrade -y 
```
I would suggest a server reboot here, so it picks up the new kernel, if one is installed.

### Installing and Configuring DevStack

Create a new user named stack and switch to that user:
```
useradd -s /bin/bash -d /opt/stack -m stack
echo "stack ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers
su - stack
```
Then get the latest Devstack from its Github repository:
```
sudo apt-get install git -y
git clone https://git.openstack.org/openstack-dev/devstack 
```
Once that finishes, you will see a devstack directory created. Navigate to that directory and create a new file named local.conf with the following details: 

*   **_Note!_** I am using the IPs I mentioned above, make sure to change the four (4) passwords as well. 
*   **Warning!** This setup will hijack the configuration of Packet's default bond0 and create a new br-ex bridge. It will also modify the routes of the server. If you reboot, the server will not have network, since the changes on the network side are not permanent.
```
[[local|localrc]]

PUBLIC_INTERFACE=bond0

HOST_IP=147.75.x.2

FLOATING_RANGE=147.75.x.0/28

PUBLIC_NETWORK_GATEWAY=147.75.x.1

Q_FLOATING_ALLOCATION_POOL=start=147.75.x.3,end=147.75.x.6

ADMIN_PASSWORD=supersecret

DATABASE_PASSWORD=iheartdatabases

RABBIT_PASSWORD=flopsymopsy

SERVICE_PASSWORD=iheartksl

VOLUME_BACKING_FILE_SIZE=25000M
```
Save and close the file. Now run the DevStack installer:
```
./stack
```
This is quite a long script, and will take between around minutes on a c1.small). Once the script finishes, you will see the following messages:
```
This is your host IP address: 147.75.x.2
Horizon is now available at http://147.75.x.2/dashboard
The default users are: admin and demo
The password: supersecret
```
Well done! Now we have an OpenStack environment ready to play with.

### Creating Your First VM

There are a few different ways to create VMs, from creating a Bootable Volume using an ISO image to using a Cloud qcow2 Image.  For the sake of simplicity, we'll create a Bootable Volume with a CentOS 7 NetInstall ISO. 

### Security Groups

First, you need to add some security group rules.  Make sure you are in the admin area of the UI, then add the following rules under Project > Network > Security Groups > Manage Rules:

*   All ICMP - Ingress - CIDR - 0.0.0.0/0
*   SSH - CIDR - 0.0.0.0/0

You'll also want to specify your DNS server and enable DHCP under Project > Network > Networks > Public > Subnets > Edit Subnet > Subnet Details > Enable DHCP.   Add the Nameservers of your choice.

### Install the Image

Now you can add a CentOS 7 Netinstall Image (available [here](http://isoredirect.centos.org/centos/7/isos/x86_64/)) by going to Project > Images > Create Image.

1.  Give it a name, select your Image, select ISO option, and then click Create Image.
2.  Depending on your network connection, you might have to wait a moment.

### Create a Temporary Instance

Next, we will create a temporary instance.  Navigate to Project > Compute > Instances > Launch Instance

1.  Give your instance a name, select Image on the Boot Source
2.  Select "No" on Create New Volume, and then click the arrow on the image that was just created from the list.
3.  Finally, select one of the available flavors (I’m going with m1.small) and click Launch Instance.

### Create an Empty Volume

The next step is to create an empty volume (where we will install CentOS later) via Project > Volumes > Volumes > Create Volume

1.  Give the volume a name, make sure to select the empty volume option, and the size 20Gb.
2.  Next, select Manage Attachments on the Actions, and choose the instance that was just created.

### Install CentOS

Now, go back to the instance, reboot it, and you should be able to get on its console.

1.  When asked, you can install a minimal by using the Centos Mirror [http://mirror.centos.org/centos/7/os/x86\_64/ ](http://mirror.centos.org/centos/7/os/x86_64/)
2.  Enable Eth0 and check to see if the IPs are correct.
3.  Wait for the Installation to complete.
4.  After completing the installation, go ahead and shutdown the instance.

### Bootable Volume

The final step is to make your volume bootable, this will allow you to attach other instances and boot from them directly.  

1.  Navigate to Project > Compute > Volumes > Actions
2.  First you will have to detach it, and then Edit Volume to select the Bootable option.

### Conclusion

You now have a CentOS 7 Volume ready, which you can use for VMs. I suggest creating a snapshot at this point, which you can use to duplicate Volumes later.  

If everything was done correctly, then launching a new instance with a CentOS volume will be smooth sailing, and it will have network so you can access via ssh.
