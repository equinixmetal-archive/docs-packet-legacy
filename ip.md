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

### Default IPv4 Subnet

Provisioning a new server, Packet assigns the following public IPv4 address subnets depending on the official Operating System you select:

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

### Creating a Reserved Subnet via Customer Portal

Select the Project in which the reserved subnet is required. From within that specific project, click on IPs & Networks & click on Request IP Addresses

From the slide out, you can select the size, type, and facility of the reserved subnet. Be sure to include detailed information for the use case for the requested subnet. 


![projects-ips-networks](project-ips-networks.png)


#### Provisioning a server with a single reserved subnet via Customer Portal

![deploy-reserved-subnet](deploy-reserved-subnet.png)

#### Provisioning a server with multiple reserved subnets via Customer Portal

![deploy-reserved-subnets-multi](deploy-choose-reserved-subnet.png)

#### Provisioning server with reserved subnet(s) via API


An example payload to create a single instance with a subnet size of /29 & using IPs from a reserved subnet. 

```
curl  -v \
      -X POST "https://api.packet.net/projects/$PROJECT_ID/devices/batch" \
      -H 'Content-Type: application/json' \
      -H "X-Auth-Token: $PACKET_API_TOKEN" \
      -d @- <<-'EOF'
      {
        "batches": [
          {
            "hostname": "enhanced-ip-alloc-batch-test-01",
            "operating_system": "ubuntu_16_04",
            "plan": "baremetal_0",
            "facility": "ewr1",
            "quantity": 1,
            "ip_addresses": [
              { "address_family": 4, "public": false },
              { "address_family": 4, "public": true, "cidr": 29, "ip_reservations": ["$EWR1_RESERVATION_ID"] },
              { "address_family": 6, "public": true }
            ]
          }
        ]
      }
EOF

```

This above paypload will again create a single new instance in EWR1, with its public IPV4 IPs assigned out the reserved subnet as called with `$EWR1_RESERVATION_ID`.

