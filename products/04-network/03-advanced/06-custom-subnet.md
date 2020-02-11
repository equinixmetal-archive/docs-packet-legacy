<!-- <meta>
{
    "title":"Custom Subnet",
    "description":"Provision servers with a custom number of IP addresses.",
    "tag":["custom", "subnet", "IP"],
    "seo-title": "Custom Subnet Size - Packet Developer Docs",
    "seo-description": "Provision servers with a custom number of IP addresses.",
    "og-title": "Custom Subnet Size",
    "og-description": "Provision servers with a custom number of IP addresses."
}
</meta> -->



When you provision a new server, Packet assigns the following public IPv4 address blocks depending on the official Operating System you select:

* __Linux Distros:__ /31
* __Windows Server 2012 r2:__ /30
* __VMware ESXI:__ /29


This configuration works great in most use cases.  However, sometimes you need more IPs by default.  

While you can certainly leverage Packet's [Elastic IP](https://www.packet.com/developers/docs/network/basic/elastic-ips/) functionality to request a larger block of IPs and tap into them as needed, in many cases requesting a larger block size per server is the easiest way to go.   

To support this, Packet allows you to request various subnet sizes when you deploy a new server:

* /31  (2 IPv4 address)
* /30  (4 IPv4 addresses)
* /29  (8 IPv4 addresses)
* /28   (16 IPv4 addresses)   

### Usage
* __Portal:__ From the Packet portal, you can select a custom subnet size as an additional option under Manage.

![Choose Custom Subnet](/images/custom-subnet/Deploy-Custom-Subnet.png)

* __API:__ If you are using the API, you can use the parameter public_ipv4_subnet_sizewhich will accept an integer of the CIDR notation. Here is an example:
```
curl -X POST -H "Content-Type: application/json" -H "X-Auth-Token: token" -d '{
  "hostname": "custom",
  "plan": "baremetal_1",
  "billing_cycle": "hourly",
  "facility": "ewr1",
  "operating_system": "ubuntu_16_04",
  "public_ipv4_subnet_size":29
}' "https://api.packet.net/projects/project_UUID/devices"
```

After provisioning the server with the API call, you will find the /29 subnet on the server detail page.

![Manage IPs](/images/custom-subnet/Manage-IPs.png)

### Billing
Please note that anything over a single IPv4 per server is billable at a rate of $0.005/hr (equal to about $3.60 per month per IP). 