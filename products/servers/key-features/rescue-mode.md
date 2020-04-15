<!-- <meta>
{
    "title":"Rescue Mode",
    "description":"Learn how to access rescue mode",
    "tag":["rescue", "password", "reset"],
    "seo-title": "Rescue Mode - Packet Developer Docs",
    "seo-description": "Learn how to access rescue mode",
    "og-title": "SOS: Serial over SSH",
    "og-description": "Learn how to access rescue mode"
}
</meta> -->
There are times when a server becomes unreachable over SSH due to broken networking, a bad install, misconfiguration, a kernel upgrade, bad firewall rules, etc.

If you have your server's root password and your SSH key, you should use our [S.O.S (Serial over SSH) service](https://www.packet.com/developers/docs/servers/key-features/sos-serial-over-ssh).

### Using Rescue Mode

When you can’t log into your server at all (e.g. you don't have the root password or the server won’t boot up) you can use our Rescue Mode, which loads a vanilla Alpine Linux image into your server's RAM.

To enter Rescue Mode, you need to access the server’s detail page via the Packet portal.   Click on Rescue within the Server Actions dropdown.

Clicking on `Rescue` reboots the server and loads the Rescue OS. Once Rescue OS is loaded, the server boots into it.

Now you can SSH in as root using authorized SSH Keys:

```
ssh -i /path/to/private.key root@SERVER_IP_HERE
===============================================
   Rescue environment based on Alpine Linux 3.x
Use "apk" package manager for additional utilities.
See docs at http://wiki.alpinelinux.org
localhost:~#
```

### Mount Original Root Partition

Next, you'll need to mount the original OS's root partition.

For t1.small servers, the root partition is located in /dev/sda3.

`mount -t ext4 /dev/sda3 /mnt`

For c1.small, m1.xlarge, and c1.xlarge servers, the root partition is located in _/dev/mdxxx*_.

`mount -t ext4 /dev/mdxxx*/mnt`

**note:** replace xxx with the actual number of the md device.

Once you have access to the root partition you can repair it.

```
localhost:/mnt#ls
bin    dev    home    lib64    media opt        root
sbin   sys    usrboot etc      lib   lost+found mnt
proc   run    srv     tmp      var
```

In order to get back to the Original OS, we can simply reboot the server.

### Common Use Cases / Situations

**#1 - Reset root password**
In cases when you can normally SSH into your server and can’t use SOS because you have forgotten or haven’t saved the root password, you can reset it through Rescue.

* Option 1:

  After mounting the root filesystem to /mnt, we can use chroot to load the mounted filesystem and directly use the sudo passwd command to modify the existing root password.

  ```
  chroot /mnt /bin/bash

  sudo passwd
  ```

* Option 2:

  We can also simply modify the shadow file containing the code for the root password, which will result in the root account being password-less.

  `vi /mnt/etc/shadow`

  On the first line, there is a root:$X$SK5xfLB1ZW:0:0 …

  In order to delete the password, we have to delete everything between the first and second semicolon. After that, save the file and reboot the server.

  _Thus "root:$X$SK5xfLB1ZW:0:0..."  gets converted to: "root::0:0..."_

  Keep in mind this will remove the root password completely, after a reboot you will have to use our SOS Console to access the machine using password authentication, and set a new password using:

  `sudo passwd`

**#2 - Recover files**

If the server cannot boot anymore into the original OS and you need to use Rescue to recover any important files.

So if I have a demo folder located at /root and I need to recover those files, after mounting the root filesystem, I can save those on my local computer:

`scp -r root@Server_IP:/mnt/root/demo /User/Downloads`

**#3 - Resize the OS root partition or create additional partitions**

By default, the boot drive will have a root partition that utilizes all the drive space. Some servers have additional unformatted drives but if you need to create multiple partitions in the same boot drive, you will need to go into rescue mode to shrink the root partition and create new ones.

The process for doing this can differ depending on the filesystem that you use but if using an OS with ext4 such as Ubuntu, you can use resize2fs and gdisk to resize your filesystem/partition and create additional ones.

It's worth noting that the default cloud-init configuration file in our images has the `growpart` and `resizefs` modules enabled which will resize your root partition back to it's max drive size if you only shrink the partition but not create additional ones. If you would like to avoid this behavior, you can edit the cloud-init configuration file found at `/etc/cloud/cloud.cfg` to remove the `-growpart` and `-resizefs` modules. Once you save the file, cloud-init should not attempt to resize the partition every time the OS boots.


### How do you run a FSCK on the drive(s)?
The rescue image is Alpine Linux. The default live image that is used is missing a package necessary to perform a 'FSCK'  to proceed please install the following package:

`apk add e2fsprogs`

After successful installation of aforementioned package, you can simply run the 'FSCK' by running, for example (drive name may very):

`fsck.ext4 -f -y /dev/md127`

In addition to the e2fsprogs package, the Alpine linux image is also missing other packages that might be required for special operations such as formatting a partition with a filesystem other than ext4 such as zfs. You can find all the available packages to install in Alpine [here](https://pkgs.alpinelinux.org/packages).
