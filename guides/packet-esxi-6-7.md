<!-- <meta>
{
    "title":"VMware ESXi 6.7 on Packet",
    "description":"Deploy VMware ESXi 6.7 on Packet Bare Metal Servers",
    "tag":["DevStack", "OpenStack"],
    "seo-title": "VMware ESXi 6.7 on Bare Metal - Packet Technical Guides",
    "seo-description": "Deploy VMware ESXi 6.7 on Packet Bare Metal Servers",
    "og-title": "VMware ESXi 6.7 on Packet",
    "og-description":"Deploy VMware ESXi 6.7 on Packet Bare Metal Servers"
}
</meta> -->

### VMware ESXi 6.7 on Packet Bare Metal Servers

To get a VMware ESXi 6.7 server up and running on Packet, you need to deploy an ESXi 6.5 server and run the ESXi 6.7 update through an SSH session on the server.

First make sure that SSH and Shell are enabled on the server, they should be enabled by default on Packet but if not, run the following:

```
vim-cmd hostsvc/enable_ssh
vim-cmd hostsvc/start_ssh
```

Swap must be enabled on the datastore. Otherwise, the update may fail with a "no space left" error.
```
esxcli sched swap system set --datastore-enabled true
esxcli sched swap system set --datastore-name datastore1
```

Prepare the server for the update and run the update. You can get the latest VMware ESXi update versions [here](https://esxi-patches.v-front.de/ESXi-6.7.0.html).

```
vim-cmd /hostsvc/maintenance_mode_enter

esxcli network firewall ruleset set -e true -r httpClient

# The update version can be retrieved from the website above
esxcli software profile update -d https://hostupdate.vmware.com/software/VUM/PRODUCTION/main/vmw-depot-index.xml -p ESXi-6.7.0-20191204001-standard

esxcli network firewall ruleset set -e false -r httpClient

vim-cmd /hostsvc/maintenance_mode_exit

reboot
```

Once the update has completed, the server should now be running VMware ESXi 6.7!

If you are looking for an automated way of doing this, we have a Terraform script that lets you deploy multiple servers with VMware ESXi 6.7 [here](https://github.com/enkelprifti98/packet-esxi-6-7).
