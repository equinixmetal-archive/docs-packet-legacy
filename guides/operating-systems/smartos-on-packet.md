<!-- <meta>
{
    "title":"SmartOS on Packet",
    "description":"Standing up SmartOS on Packet utilizing custom iPXE",
    "tag":["OS", "SmartOS"],
    "seo-title": "SmartOS on Packet - Packet Technical Guides",
    "seo-description": "Deplying SmartOS on Packet",
    "og-title": "Deplying SmartOS on Packet",
    "og-description":"Deplying SmartOS on Packet"
}
</meta> -->


# SmartOS on Packet

Packet’s Custom iPXE boot option allows users to boot a system image like that of SmartOS persistently across boots, on top of a local storage ZFS pool for the VM and zone data on the node itself, to provide a fast and easily administered hypervisor operating system experience.

## Booting

After acquiring the SmartOS archive image, decompressing it in any web-facing path (this can be in object storage, behind a webserver, etc. as long as the path is web reachable). For example, in the leanest possible example, you can place it in an Nginx path like `/usr/share/nginx/html/smartos`, and then, in that path, at `/usr/share/nginx/html/smartos.ipxe`, you can add the following iPXE manifest:

```
    #!ipxe

    dhcp

    set base-url http://${YOUR_HOST_ADDR}

    kernel ${base-url}/smartos/smartos/platform/i86pc/kernel/amd64/unix -B smartos=true,console=ttyb,ttyb-mode="115200,8,n,1,-"

    module ${base-url}/smartos/smartos/platform/i86pc/amd64/boot_archive type=rootfs name=ramdisk

    boot
```

Which will, for example, set a relative path for your webserver to refer to the kernel and boot module files on disk.

In your Packet console, you can create a new instance, and select Custom iPXE as your Operating System:

![custom-ipxe-1](/images/smartos-on-packet/01-new.png)
![custom-ipxe-2](/images/smartos-on-packet/01-2-new.png)

Then, in the text field below that selection, you will paste the full path to your iPXE script:

```
http://${YOUR_HOST}/smartos.ipxe
```

## Configuring SmartOS

Because this is the first boot, you will need to configure things like a root password, a network configuration for your management interface, and the storage pool for your instance.

After hitting “Deploy Servers” in your Packet console, you’ll find, one it’s online, you will need to use the SOS console to complete the setup.

![smartos-node-address](/images/smartos-on-packet/02.png)

You’ll find your SSH information to access the console on the Out-Of-Band Console link pictured. Make note of your network configuration as well, as you’ll need this when connecting to the SmartOS setup screens to follow.

The first thing you’ll want to do, however, before setting up the host is, in the Packet console, clicking “Server Actions” and setting this host to “Always Boot from PXE” in order to ensure that, on each boot, SmartOS is bootable, as this OS is not typically installed to disk, and will be delivered over the network on subsequent boots (with your persistent installation specific things like passwords, users, VM data, all stored in the node storage pool):

![set-boot-ipxe](/images/smartos-on-packet/03.png)

Once you connect to your Console, you’ll see a setup screen like this, which will prompt you to select the NIC to use for the admin interface. Ideally, this will not be Internet-facing, however, you are welcome to plug in your Public network details here as well for use with SSH:

![admin-network](/images/smartos-on-packet/04.png)

From there, you’ll be prompted for the IP, netmask, gateway, and DNS resolvers for this interface.

The next step is to configure storage, which SmartOS will make a recommendation for a storage pool:

![storage-pool](/images/smartos-on-packet/05.png)

If the default works for you, then type “yes”, and continue, however, there are other options for SmartOS storage configurations, or manually defining options if you’ve decided to, for example, attach network storage, or add block devices.

Your final step is to configure a root password for the device:

![root-password](/images/smartos-on-packet/06.png)

You’ll use the root user and password you set here, once the host has rebooted, to access the admin interface to begin using SmartOS, once the installation has completed:

![installation](/images/smartos-on-packet/07.png)

Once complete, you’ll be prompted to hit “Enter” to reboot the host, and complete installation. You can monitor the console to ensure the host comes back online, and if successful, it will boot to the Joyent SmartOS login screen:

![complete](/images/smartos-on-packet/08.png)

You are ready to proceed and login over your configured administrative interface over SSH and begin deploying your zones.
