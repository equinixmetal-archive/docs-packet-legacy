
<!-- <meta>
{
    "title":"Block Storage on Windows Server",
    "description":"Deploying Block Storage on Packet Windows Servers",
    "tag":["Storage", "Block Storage", "Elastic Block Storage", "Windows", "Windows Server"],
    "seo-title": "Block Storage on Windows Server - Packet Technical Guides",
    "seo-description": "Deploying Block Storage on Packet Windows Servers",
    "og-title": "Block Storage on Windows Server",
    "og-description": "Deploying Block Storage on Packet Windows Servers"
}
</meta> -->

# Elastic Block Storage on Windows Server

## Prerequisites

In order to add extra storage to your Windows Server instance, you will need to create a block storage volume in your project. You can do so by going to the Storage tab on the top of the project overview page.

![elastic-block-storage](/images/elastic-block-storage/storage1.png)

Click on "New Storage Volume", give the volume a description, choose the size of the volume in GB (100 GB is the minimum size), select the performance tier and location. You also have the option to configure snapshots. Once you've entered all of the information, click Deploy to create your block storage volumes.

![create-block-storage](/images/elastic-block-storage/storage2.png)

### Snapshots

A snapshot is a differential copy of your volume made at a specific moment in time. If you have a 500GB volume, but only 250 GB of data on it, your snapshot is only 250 GB. With a snapshots, you are only billed for the changes to the original block device from the time the snapshot is made — as such, a policy of 5 snapshots may end up being only a small amount of storage if your rate of change on the device is low. Billing for all snapshots is at our lower $0.07/GB per month tier.

### Performance Tiers

When you need persistent storage, with built-in replication and snapshots, our block storage product is a very useful tool.  We offer two performance tiers:

* **Standard Tier:**  ($0.000104/GB per hour) - With 500 IOPS per volume this is good for backups, dev/test, and medium use datasets.

* **Performance Tier:** ($0.000223/GB per hour) - With 15,000 IOPS per volume this is targeted at higher I/O heavy workloads.


### Attach / Detach the Volume to the Server

After your volume is created, you need to route it to the server you would like to mount it on.  To do so, go to the server detail page that you'd like to connect the block device to and click on the Storage submenu on the left.  Select your volume from the drop-down box and click 'Attach'.  This routes the volume to your block device and allows you to mount it from your local server via iSCSI.


Once attached to your server, you will see the volume name, size & where it is located:

![storage-attach-ui](/images/elastic-block-storage/storage-attach-ui.png)

Please note that a block storage volume is meant to be used by a single server instance at a time, you cannot share the volume with multiple server instances at once. You can however attach multiple block storage volumes to the same server instance. At this point, we’re done with the Packet portal and can start the configuration process on the server instance.

## Accessing the server instance

You will need to use RDP to remotely access the windows server instance by adding a connection with your server’s management IPv4 address. The default login will be the admin user and the temporary password provided by Packet. Please note that we don’t show the password on the portal after 24 hours since the instance was created so make sure to change the admin password once you have access to the server instance.

## Automated Method with Interactive Helper Script

For those who prefer a more automated method (faster and easier) of connecting your block storage volumes to your windows server instance, we have created an interactive helper script for connecting / disconnecting your volumes [here](https://github.com/enkelprifti98/packet-block-storage-windows).

Please note that the helper script does not connect your volumes in a persistent way, meaning that your connected volumes will disconnect if you reboot your server instance so you will have to run the attach script again to reconnect your volumes after a reboot. If you want your block storage volumes to be persistent across reboots, you can follow the rest of this manual GUI guide.

The helper script also does not partition, format, and mount your volumes so you will have to do that process manually. This process is covered at the end of this guide under the "Partitioning and Mounting the Volume" section.

## Enabling iSCSI and Multipath (MPIO) support on Windows Server

The first thing we will need to do is enable Multipath (MPIO) support on Windows. To do this, open the Server Manager app (it opens automatically when you connect to your instance with RDP), and on top right corner click “Manage”, then select “Add Roles and Features”.

![add-feature](/images/elastic-block-storage-windows-server/add-feature.png)

A wizard will show up that will walk you through, you will need to click “Next” (default selections are fine) a few times until you reach the Features section. Make sure to select Multipath I/O, click “Next”, then click “Install”. Once the installation is done, the wizard will say that a restart is required to complete the process. Click the “Close” button and restart the server instance. (Note that you also have the option to tick the box for automatically restarting the server if required once you select the Multipath I/O feature to install)

![enable-multipath](/images/elastic-block-storage-windows-server/enable-multipath.png)

Once you log back in, on the upper right corner of the Server Manager app, click “Tools”, then select the “MPIO” option.

![open-MPIO](/images/elastic-block-storage-windows-server/open-MPIO.png)

An MPIO Properties window will open, go to the “Discover Multi-Paths” tab, then on the SPC-3 compliant section you will need to tick the box for “Add support for iSCSI devices” and click the “Add” button. A window will pop up prompting you to restart the server, click “Yes”.

![spc-3-support](/images/elastic-block-storage-windows-server/spc-3-support.png)

## Configuring iSCSI and Multipath

Once you get back in the server, on the upper right corner of the Server Manager app, click “Tools”, then select the “iSCSI Initiator” option.

![iSCSI-initiator](/images/elastic-block-storage-windows-server/iSCSI-initiator.png)

A window will pop up prompting you to start the iSCSI service, click “Yes”. Then the iSCSI Initiator Properties windows will pop up but at this point we will need to get the server’s IQN and the block storage volume IPs needed to start the iSCSI sessions.

To get the server IQN and volume IPs, we will be utilizing Packet’s [Metadata service](https://www.packet.com/developers/docs/servers/key-features/metadata/) which provides important information about your server such as hostname, IPs, block storage volumes attached and others. We will use Internet Explorer to retrieve the Metadata of the server but you can use any other browser. First you will need to add the Metadata URL as a trusted site.

`https://metadata.packet.net/metadata`

By default there is a security feature in place which will prevent you from accessing this URL.

In Internet Explorer, click the gear (top right) > Internet Options > Security tab > Trusted Sites icon with a green checkmark. Click on the "Sites" button and add the Metadata URL.

![metadata-trusted-site](/images/elastic-block-storage-windows-server/metadata-trusted-site.png)

Now navigate to `https://metadata.packet.net/metadata` in the browser and it will prompt you to access the site securely, then download (bottom of screen) a `metadata.json` file in your downloads folder. Navigate to the downloads folder and find the metadata file, right click on the file, select “open with”, then click on “try an app on this PC”, select Notepad and click OK. The notepad window will open that shows your metadata information, it’s a bit difficult to read but we will only need the IQN of the server and volume IPs. The IQN is on the first line of the metadata file, next to the hostname and looks as follows:

`"iqn":"iqn.2020-01.net.packet:device.2d0315e2”`

The IPs of the volumes are on the last line and look like the following example:

`"volumes":[{"ips":["10.144.35.96","10.144.50.199”]`

**Note:** Please note that the block storage volume will also have it’s own IQN but we don’t need it to setup the volume. It will have the "Datera" name instead of "Packet" (`iqn.2013-05.com.daterainc:tc:01:sn:e2a157c195040ba7`).

Once you have that information ready, go back to the iSCSI Initiator properties window, then go to the last tab “Configuration”. There you will need to change the initiator name, click the “change” button and paste your server instance IQN (`iqn.2020-01.net.packet:device.2d0315e2`), then click OK.

![server-IQN](/images/elastic-block-storage-windows-server/server-IQN.png)

Next, go to the “Discovery” tab, under the Target Portals sections, click the “Discover Portal” button. Here you will need to enter the IP addresses of the volume that we retrieved earlier. You will need to do this step twice for each IP address. The port can be left as default.

![volume-IP](/images/elastic-block-storage-windows-server/volume-IP.png)

At this point, the volume should be discovered and showing in the Targets tab, under the Discovered targets section, with the volume IQN which should match the IQN of the volume from the metadata file. (`iqn.2013-05.com.daterainc:tc:01:sn:e2a157c195040ba7`)

![discovered-volume](/images/elastic-block-storage-windows-server/discovered-volume.png)

Now we can connect the volume with multipath. Select the discovered volume target and click the “Connect” button. On the new window, tick the box for “Enable multi-path”. The "Add this connection to your favorite targets" box is ticked by default and will make your connected volume persistent across server reboots but you can untick that box if you do not want the volume to be persistent across reboots. Next, click the “Advanced” button. On the Advanced Settings window, click the “Local Adapter” dropdown and set it to the “Microsoft iSCSI Initiator”. For the “Initiator IP”, it will be the private IPv4 address (10.x.x.x) of your server instance and you can get it from the Packet portal on the instance overview page. The “Target portal IP” will be the IPs of the volume that we setup earlier, but here you can select the first one. Click OK, then OK again and the volume will be connected now, but we need to add the second path for the second IP address of the volume.

![first-path-session](/images/elastic-block-storage-windows-server/first-path-session.png)

To do this, click the volume and click the Properties button, on the new window click the Add session button, tick Enable multi-path, then click advanced, and follow the same process as earlier (Microsoft iSCSI Initiator, same server IP (10.x.x.x) that was used earlier, but for the Target portal IP, choose the second IP instead of the first one that we used earlier).

![second-path-session](/images/elastic-block-storage-windows-server/second-path-session.png)

(Note: This is not required but if would like to customize Multipath settings further such as the load balance policy and type of state, you can do that in the volume properties window, click the Devices button, then click the MPIO button on the new window, and there you will be able to configure Multipath as you wish. The default settings of Round Robin with Subset and both sessions set as Active are fine.) 

## Partitioning and Mounting the Volume

At this point, the volume is attached to Windows but it will need to be partitioned, formatted with a filesystem, and mounted so that it can be used. To do this, launch Control Panel, on the top right corner search for “partition”, and the result should be “Create and format hard disk partitions” under “Administrative Tools”, click it. A “Disk Management” window will open where you can manage your volumes. On the bottom, you should see your local drives as well as your block storage volume in an offline state. Right click on the offline volume and click “Online”.

![set-volume-to-online](/images/elastic-block-storage-windows-server/set-volume-to-online.png)

Right click the volume again and click “Initialize Disk”.

![initialize-volume](/images/elastic-block-storage-windows-server/initialize-volume.png)

You have an option to choose your partition style, I recommend GPT as it is a newer standard that supports volumes larger than 2 TB while MBR is limited to 2 TB for the maximum volume size. Click OK, and the volume should now be initialized and online.

![partition-style](/images/elastic-block-storage-windows-server/partition-style.png)

Next, you need to right click the black bar area and select “New Simple Volume”.

![new-simple-volume](/images/elastic-block-storage-windows-server/new-simple-volume.png)

A wizard will pop up to create a partition and format it with a filesystem. You can select next and use all the default settings but feel free to change settings such as a specific partition size, filesystem of your choice, drive letter, and volume label. 

![filesystem](/images/elastic-block-storage-windows-server/filesystem.png)

Click finish to setup the volume, once the volume is in a healthy status, it is ready to be used. You can open file explorer, go to This PC on the left sidebar, and your block storage volume will show up there so you can start creating or transferring files.

![file-explorer-volume](/images/elastic-block-storage-windows-server/file-explorer-volume.png)

## Detaching / Deleting or Moving the Volume to another Server

If you want to delete or move the volume to another server, you will need to disconnect the volume in Windows and then detach the volume from the instance in the Packet portal.

To disconnect the volume from Windows, go back to the Disk Management application, right click the volume and click "Offline". Then, open the Server Manager app, click on Tools, open iSCSI Initiator. Under the discovered targets section, select the target volume, then click the "Diconnect" button. It will prompt you to disconnect from all sessions (2 sessions) and click "Yes".

Now you will neeed to detach the volume from the server in the Packet portal by going to the instance overview page, the storage section on the left hand side, and click the "Detach" button on the volume.

If you would like to delete the volume, you can delete it from the Storage tab at the top of the project overview page. If you would like to attach the volume to another server instance, you will need to follow the same configuration process that we did earlier.
