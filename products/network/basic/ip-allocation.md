<!-- <meta>
{
    "title":"IP Allocation",
    "description":"Provision servers with a reserved subnet",
    "tag":["Elastic IPs", "Subnets", "Reserved Subnets", "IPs"],
    "seo-title": "IP Allocation - Packet Developer Docs",
    "seo-description": "Provision servers with a reserved subnet",
    "og-title": "IP Allocation",
    "og-description": "Provision servers with a reserved subnet"
}
</meta> -->


#### Default IPv4 Subnet

Provisioning a new server, Packet assigns the following public IPv4 address subnets depending on the official Operating System you select:

* __Linux Distros:__ /31
* __Windows Server 2012 r2:__ /30
* __VMware ESXI:__ /29


#### Reserving Larger Subnet(s) via Portal

Packet allows you to reseve the following sizes:

| Elastic IPs        |Usable |   | Global Anycast | Usable |
| ------------- |:-------------:| -----:| -----:| -----:
| /31    | 2 IPv4 | | /32       | 1 IPv4
| /30    | 4 IPv4 | | /31       | 2 IPv4
| /29    |8 IPv4|   | /28       | 4 IPv4
| /28    |16 IPv4|

> **Please Note:**  anything over a single IPv4 per server is billable at a rate of $0.005/hr for Elastic IPs & $0.15/hr for Global Anycast IPs. 

#### Creating a Reserved Subnet via Customer Portal

Select the Project in which the reserved subnet is required. From within that specific project, click on IPs & Networks & click on Request IP Addresses

From the slide out, you can select the size, type, and facility of the reserved subnet. Be sure to include detailed information for the use case for the requested subnet. 


![projects-ips-networks](/images/ip-allocation/project-ips-networks.png)


#### Provisioning a server with a single reserved subnet via Customer Portal

![deploy-reserved-subnet](/images/ip-allocation/deploy-reserved-subnet.png)

#### Provisioning a server with multiple reserved subnets via Customer Portal

![deploy-reserved-subnets-multi](/images/ip-allocation/deploy-choose-reserved-subnet.png)

#### Provisioning server with reserved subnet(s) via API


Example API payload to create a single instance with a subnet size of /29 & using IPs from a reserved subnet. 

```
curl  -v \
      -X POST "https://api.packet.net/projects/$PROJECT_ID/devices" \
      -H 'Content-Type: application/json' \
      -H "X-Auth-Token: $PACKET_API_TOKEN" \
      -d @- <<-'EOF'
      {
        "hostname": "enhanced-ip-alloc-test-02",
        "operating_system": "ubuntu_16_04",
        "plan": "baremetal_0",
        "facility": "ewr1",
        "ip_addresses": [
          { "address_family": 4, "public": false },
          { "address_family": 4, "public": true, "cidr": 29, "ip_reservations": ["$EWR1_RESERVATION_ID"] },
          { "address_family": 6, "public": true }
        ]
      }
EOF
````
Example API Payload using 2 IP reservations when deploying from the batch API endpoint across multiple facilities. 

Since the `$EWR1_RESERVATION_ID` reservation is a `/28`, and 3 instances with `/29` cidr blocks are requested, only 2 will provision in the EWR1 reservation, while the third will go to NRT1.

```curl  -v \
      -X POST "https://api.packet.net/projects/$PROJECT_ID/devices/batch" \
      -H 'Content-Type: application/json' \
      -H "X-Auth-Token: $PACKET_API_TOKEN" \
      -d @- <<-'EOF'
      {
        "batches": [
          {
            "hostname": "enhanced-ip-alloc-batch-test-0X",
            "operating_system": "ubuntu_16_04",
            "plan": "baremetal_0",
            "facility": ["ewr1", "nrt1"],
            "quantity": 3,
            "ip_addresses": [
              { "address_family": 4, "public": false },
              { "address_family": 4, "public": true, "cidr": 29, "ip_reservations": ["$EWR1_RESERVATION_ID", "$NRT1_RESERVATION_ID"] },
              { "address_family": 6, "public": true }
            ]
          }
        ]
      }
EOF
````

#### Creating an IP Reservation 

````
curl  -v \
      -X POST "https://api.packet.net/projects/$PROJECT_ID/ips" \
      -H 'Content-Type: application/json' \
      -H "X-Auth-Token: $PACKET_API_TOKEN" \
      -d @- <<-'EOF'
      {
        "type": "public_ipv4",
        "quantity": 4,
        "comments": "for mytestserver.com",
        "facility": "ams1",
        "details": "my /30 in AMS1"
      }
EOF
````
> **_Please Note:_** The quantity parameter should be the number of IPs in the subnet, valid values are 2, 4, 8, 16. IP reservations larger than 16 will require additional verification by packet)

The output would be similar to:
```{
  "id":"18c40668-f9b6-4cdc-b50e-0f8729d4f2f6",
  "address_family":4,
  "netmask":"255.255.255.252",
  "created_at":"2020-02-20T18:53:52Z",
  "details":"my test /30 in AMS1",
  "tags":[],
  "public":true,
  "cidr":30,
  "management":false,
  "manageable":true,
  "enabled":true,
  "global_ip":false,
  "customdata":{},
  "addon":true,
  "bill":true,
  "project":{"href":"/projects/c895ea67-40ce-4f98-bd97-fe0b2e771481"},
  "project_lite":{"href":"/projects/c895ea67-40ce-4f98-bd97-fe0b2e771481"},
  "assignments":[],
  "facility":{"id":"8e6470b3-b75e-47d1-bb93-45b225750975","name":"Amsterdam, NL","code":"ams1","features":["baremetal","storage","global_ipv4","backend_transfer","layer_2"],"address":{"href":"#0688e909-647e-4b21-bdf2-fc056d993fc5"},"ip_ranges":["2604:1380:2000::/36","147.75.204.0/23","147.75.100.0/22","147.75.80.0/22","147.75.32.0/23"]},
  "network":"147.75.80.220",
  "address":"147.75.80.222",
  "gateway":"147.75.80.221",
  "available":"/ips/18c40668-f9b6-4cdc-b50e-0f8729d4f2f6/available",
  "href":"/ips/18c40668-f9b6-4cdc-b50e-0f8729d4f2f6"
}
````
> **_Please Note_**: Should you not recieve a response from the above. A support ticket was submitted on your behalf, and our team will review the request an respond. Should you not see this ticket please [email us directly](mailto:support@packet.com)
