<!-- <meta>
{
    "title":"IP Allocation",
    "description":"Provision servers with a reserved subnet",
    "tag":["subnet", "IP"],
    "seo-title": "IP Allocation - Packet Developer Docs",
    "seo-description": "Provision servers with a reserved subnet",
    "og-title": "IP Allocation",
    "og-description": "Provision servers with a reserved subnet"
}
</meta> -->

Provisioning a new server, Packet assigns the following public IPv4 address blocks depending on the official Operating System you select:

* __Linux Distros:__ /31
* __Windows Server 2012 r2:__ /30
* __VMware ESXI:__ /29

Packet allows you to reseve the following subnet sizes:

* /31  (2 IPv4 address)
* /30  (4 IPv4 addresses)
* /29  (8 IPv4 addresses)
* /28   (16 IPv4 addresses) 

> **Please Note:**  anything over a single IPv4 per server is billable at a rate of $0.005/hr (equal to about $3.60 per month per IP). For example should you reseve a a /28, which gives you 16 IPs, you will be paying for 14 additional IPs on top of the included. 


#### Reserve a Larger Subnet via Portal

Select the Project in which the reserved subnet is required. From within that specific project, click on IPs & Networks & click on Request IP Addresses

![projects-ips-networks](/images/ip-allocation/project-ips-networks.png)

