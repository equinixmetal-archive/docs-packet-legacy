<!-- <meta>
{
    "title":"CentOS: Selinux",
    "description":"Learn more about why we disable SELinux on CentOS",
    "tag":["Operating Systems", "CentOS", "SELinux],
    "seo-title": "CentOS: SELinux - Packet Developer Docs",
    "seo-description": "Learn more about why we disable SELinux on CentOS",
    "og-title": "CentOS: SELinux - Packet Developer Docs",
    "og-description": "Learn more about why we disable SELinux on CentOS"
}
</meta> -->

SELinux is incredibly valuable as part of an overall Linux system security strategy. Due to the way we automation provsioning of our CentOS devices on our platform, we have by default, disabled SELinu as shown with the `sestatus`

````
[root@ewr1-t1 ~]# sestatus
SELinux status:                 disabled
````

Should your your particular CentOS deployment require SELinux, you can easily enable it, as shown here. 

````
yum install selinux-policy selinux-policy-targeted
````
Once policy is installed, you will want to simply create a file in the `/` called `.autorelabel`. To activate SELinux you must reboot the device. 

````
shutdown -r now
````
Upon reaccessing the device, verify that SElinux is infact enable by running `sestatus` and you will see an output similar to the following: 

````
[root@ewr1-t1 /]# sestatus
SELinux status:                 enabled
SELinuxfs mount:                /sys/fs/selinux
SELinux root directory:         /etc/selinux
Loaded policy name:             targeted
Current mode:                   enforcing
Mode from config file:          enforcing
Policy MLS status:              enabled
Policy deny_unknown status:     allowed
Max kernel policy version:      31
[root@ewr1-t1 /]#
````
> **_NOTE:_**  Should you need to reinstall the OS via our server reinstall feature, you MUST disable SELinux otherwise, the device will fail to reinstall. 

To disable simply edit file ` /etc/selinux/config` change `enforcing` to `disabled` and reboot the device. Upon reaccessing the device, you can then proceed with the server reinstall feature. 
