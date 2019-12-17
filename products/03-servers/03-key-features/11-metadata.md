<!--
<meta>
{
    "title":"Metadata",
    "description":"Understanding and leveraging Packet’s metadata service.",
    "tag":["Metadata"]
}
</meta>
-->
Metadata is a service offered on every Packet server that allows it to access and share various data about itself. This kind of data includes hostname, instance ID, ssh keys, tags, assigned IPs, etc.

This information is especially useful for automation, but of course can be accessed manually.

Retrieving Metadata from Your Server
You can view the metadata by doing a cURL to https://metadata.packet.net/metadata

The output will be a long json formatted text, so you might want to use so jq to make it easier to read and digest.

```
root@metadata:~# curl -s https://metadata.packet.net/metadata | jq
{
  "id": "2885032e-61a8-4786-bd26-7b2e2e6ba1ea",
  "hostname": "metadata",
  "iqn": "iqn.2017-11.net.packet:device.2885032e",
  "operating_system": {
  "slug": "ubuntu_16_04",
  "distro": "ubuntu",
  "version": "16.04",
  "license_activation": {
  "state": "unlicensed"
 }
},
  "plan": "baremetal_1",
  "facility": "ewr1",
  "tags": [],
  "ssh_keys": [
  "ssh-rsa AAAAB3Nza............."
 ],
  "storage": {
  "disks": [
  .
  .]
  "raid": [
  .
  .]
  "filesystems": [
  .]
},
 "network": {
 "bonding": {
 "mode": 4
},
 "interfaces": [
 {
  "name": "p1p1",
  "mac": "0c:c4:7a:e1:3d:d0",
  "bond": "bond0"
  },
  {
  "name": "p1p2",
  "mac": "0c:c4:7a:e1:3d:d1",
  "bond": "bond0"
 }
],
"addresses": [
 {
  "id": "63f24352-0997-4f65-babd-6f8c9d048568",
  "address_family": 4,
  "netmask": "255.255.255.254",
  "created_at": "2017-11-04T17:03:20Z",
  "public": true,
  "cidr": 31,
  "management": true,
  "enabled": true,
  "network": "147.75.104.32",
  "address": "147.75.104.33",
  "gateway": "147.75.104.32",
  "parent_block": {
  "network": "147.75.104.32",
  "netmask": "255.255.255.254",
  "cidr": 31,
  "href": "/ips/6c2d45a7-df8b-451e-9d6d-2a1b5476a9d0"
 }
},
 "spot": {},
 "volumes": [],
 "api_url": "https://metadata.packet.net",
 "phone_home_url": "http://147.75.195.231/phone-home"
}
root@metadata:~#
```

Additionally, if you want to grab specific information from the metadata, you can use jq to filter on specific fields, or choose to any of the following options:

```
root@metadata:~# curl -s https://metadata.packet.net/2009-04-04/meta-data
instance-id
hostname
iqn
plan
facility
tags
operating-system
public-keys
public-ipv4
public-ipv6
local-ipv4
root@metadata:~# curl https://metadata.packet.net/2009-04-04/meta-data/instance-id
2885032e-61a8-4786-bd26-7b2e2e6ba1ea
```

**Note!** 2009-04-04 is a specific metadata version which we are currently using.

### Metadata and Spot Instances
As you might have seen on our Spot Market KB article, you will be able to get some information regarding the device’s termination time.

For a spot instance, there will be an additional field in the metadata: **"spot": {}**

In case the server is up for termination, meaning your spot price falls below the current bids, then you will see **termination_date** appearing into that spot field. Keep in mind that the current termination time is **120 seconds**.
