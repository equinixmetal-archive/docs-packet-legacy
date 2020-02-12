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

### Default IPv4 

Provisioning a new server, Packet assigns the following public IPv4 address blocks depending on the official Operating System you select:

* __Linux Distros:__ /31
* __Windows Server 2012 r2:__ /30
* __VMware ESXI:__ /29


### Reserving Larger Subnet(s) via Portal

Packet allows you to reseve the following sizes:

| Elastic IPs        |Usable |   | Global Anycast | Usable |
| ------------- |:-------------:| -----:| -----:| -----:
| /31    | 2 IPv4 | | /32       | 1 IPv4
| /30    | 4 IPv4 | | /31       | 2 IPv4
| /29    |8 IPv4|   | /28       | 4 IPv4
| /28    |16 IPv4|

> **Please Note:**  anything over a single IPv4 per server is billable at a rate of $0.005/hr for Elastic IPs & $0.15/hr for Global Anycast IPs. 

Select the Project in which the reserved subnet is required. From within that specific project, click on IPs & Networks & click on Request IP Addresses

From the slide out, you can select the size, type, and facility of the reserved subnet. Please be sure to include detailed information for the use case for the requested subnet. 


![projects-ips-networks](project-ips-networks.png)


#### Deploying a server with reserved subnets via Portal



![deploy-reserved-subnet](deploy-reserved-subnet.png)
