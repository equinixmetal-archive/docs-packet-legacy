<!--
<meta>
{
    "title":"Proxmox & Block Storage",
    "description":"Utilizing Block Storage with Proxmox",
    "author":"Mo Lawler",
    "github":"usrdev",
    "email":"mo@packet.com",
    "tag":["Proxmox", "EBS", "BlockStorage"]
}
</meta>
-->
### Proxmox Block Storage 

Now that you have successfully converted Debian 10 to Proxmox, this guide will assist you in adding additional storage space. Having this storage will assist in HA & live migrations, should you have a cluster setup. 


#### Creating & Attaching Storage Volume

If you have not yet created a volume, and attached the volume to your device. Please review our guide on [Elastic Block Storage guide]()




#### Adding Storage through Proxmox UI

Adding the stroage volume to Proxmox is done through going to Datacenter → Storage → iSCSI: 

![proxmox-storage](/images/proxmox-blockstorage/proxmox-storage1.png)

Continue the process on the popup window requesting information about the volume you are attaching: 

* ID: the name for your storage mount point
Portal: the IQN which is the 10.x IP address from the `packet-block-storage-attach` command you previously ran. 

* Target: once a valid 10.x IP address is adjusted you should see see a target in which you can select. 

![proxmox-storage](/images/proxmox-blockstorage/proxmox-storage2.png)

Upon completion your storage volume appears on the top under the primary storage screen 

![proxmox-storage](/images/proxmox-blockstorage/proxmox-storage3.png)

To utilize the newly added block storage volume, you must create another storage mount point, this time LVM. 

![proxmox-storage](/images/proxmox-blockstorage/proxmox-storage4.png)

The next screen prompts you for items required to complete this storage LVM. 
ID: a name you wish to call your this volume, it will contain the virtual machine disks & container images.

* Base Storage: is the iSCSI you previously added 
* Base Volume: is as shown, and the only option
* Volume Group: a name in which you want to call the storage group. 
* Content: You can have one or both, VM disk images / container images.

![proxmox-storage](/images/proxmox-blockstorage/proxmox-storage5.png)

You should now see both the iSCSI and LVM listed under storage

![proxmox-storage](/images/proxmox-blockstorage/proxmox-storage6.png)

Bravo! You now have a working block storage volume to expand your existing space for your containers / virtual machines. 
