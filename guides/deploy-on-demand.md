<!-- <meta>
{
    "title":"Deploy On Demand",
    "description":"Learn how to deploy an on demand server via customer portal",
    "tag":["On Demand", "On-Demand", "Deployment"],
    "seo-title": "On Demand Server Deployment - Packet Developer Guides",
    "seo-description": "Learn how to deploy an on demand server via customer portal",
    "og-title": "Deploy: On-Demand Server",
    "og-description": "Learn how to deploy an on demand server via customer portal"
}
</meta> -->

The following guide will assist in navigiating through deploying a device on demand.

Navigate to the Servers page in the customer portal, then click `+ New Server.` Next, choose `On Demand.`

First, select a datacenter. Our core datacenters are our biggest and have the largest inventory available. If you’d like to see all locations only in North America, or Asia Pacific, use the tabs at the top to narrow your options. If you want to browse everything, you can choose `All.`


![facility](/images/ondemand-deploy-guide/select-facility.png)

After you have chosen a datacenter, you can see the inventory available under `Select Your Server`. Here you can see the hardware type, price her hour and specs of each server class. If your selected server is off-screen, you can see in the lower left what server you’ve selected.

![server](/images/ondemand-deploy-guide/select-server.png)

Choose an Operating System. Our most popular operating systems are featured by default, but depending on the hardware, you can deploy with a large amount of OSes. We default to the latest stable OS Version, but if available, you can select an alternate using the dropdown on the OS tile. If the selected OS displays a lightning bolt, that indicates that this OS will deploy within 60 seconds.

![os](/images/ondemand-deploy-guide/selectos.png)

Once you’ve selected a datacenter, server, and operating system, you are ready to deploy! You may want to adjust the amount of servers or customize optional settings.

**⚠️Note:**
If you don’t have an [SSH Key](https://www.packet.com/developers/docs/servers/key-features/ssh-keys/), you will be prompted to add one: you can’t deploy without it!

![pxe](/images/ondemand-deploy-guide/create-ssh-key.png)

#### Optional Settings
At this point, you are ready to deploy a server, but if you'd like to make adjustments to quantity, [user data](https://www.packet.com/developers/docs/servers/key-features/user-data/), [IPs](https://www.packet.com/developers/docs/servers/key-features/custom-subnet-size/) or [SSH access](https://www.packet.com/developers/docs/servers/key-features/ssh-keys/), you can do that at this point. 

If you have chosen [Custom iPXE](https://www.packet.com/developers/docs/servers/operating-systems/custom-ipxe/), you can specify a bootup URL.
![pxe](/images/ondemand-deploy-guide/customipxe.png)

If you want to deploy more than 1 server, you can adjust it under Select Number and Name Your Server(s). You can change the prefilled hostnames if you’d like. 
![amount-of-servers](/images/ondemand-deploy-guide/amount-of-servers.png)
**⚠️Note:** You cannot use underscores in your hostname.


Packet offers the ability to make adjustments to default settings at the time of deployment.

Add User Data. If there’s a script you’d like to run after the server is deployed, you can add that here.
![user-data](/images/ondemand-deploy-guide/optional-settings.png)

Configure IPs. By default, a Packet server deploys with 1 public IPv4, 1 private IPv6 and 1 private IPv4 address. If you’d like to make adjustments, you can do that under Configure IPs.

![ips](/images/ondemand-deploy-guide/configure-ips.png)

Customize SSH Access. By default, Packet deploys with all available SSH keys, but if you’d like to adjust access, you can do that here. You must deploy with at least 1 SSH key. To learn how to create/add SSH Keys please see [this doc](https://www.packet.com/developers/docs/servers/key-features/ssh-keys/). 

![sleect-ssh-keys](/images/ondemand-deploy-guide/select-ssh-keys.png)

Now, you're ready to go!
Once you’ve made it to the Summary section, you’re ready to go! Deploy your server and get ready to experience bare metal. 
