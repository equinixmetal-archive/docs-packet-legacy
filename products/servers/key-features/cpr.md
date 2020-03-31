<!-- <meta>
{
    "title":"Custom Partitioning and RAID",
    "description":"Setting up CPR (Custom Partitioning & RAID).",
    "tag":["CPR", "Custom RAID", "RAID", "Partition", "Disk Configuration", "SATA", "HDD", "SSD", "NVMe"],
    "seo-title": "Custom Partitioning and RAID - Packet Developer Docs",
    "seo-description": "Setting up CPR (Custom Partitioning & RAID).",
    "og-title": "Custom Partitioning and RAID",
    "og-description": "Setting up CPR (Custom Partitioning & RAID)."
}
</meta> -->

# Custom Partitioning & Raid (CPR)

Custom Partitioning & Raid (CPR) is a powerful and yet easy to use feature that helps you configure the disk configuration of Reserved Hardware instances during deployment.  

_Please note: this feature is not available for on-demand instances.  A reserved device is required.  This is because with reserved devices, our system knows the exact drive scheme to allow such customization.  However, all of our machine types can be converted to reserved hardware, so just reach out to [support@packet.com](mailto:support@packet.com) to arrange a reservation._

## Getting Started

First things first, you should be familiar with the [API calls available for device provisioning](https://www.packet.com/developers/api/devices/), you'll need them! You can find examples for deploying reserved hardware [here](https://www.packet.com/developers/docs/getting-started/deployment-options/reserved-hardware).

You should also be aware of our standard disk configurations for each server type.  With a few hardware-specific exceptions, generally speaking, this looks like:

*   __t1.small.x86__:   1 × 80 GB SSD (Boot)
*   __c1.small.x86__:   2 × 120 GB SSD in RAID 1 (Boot)
*   __c1.large.arm__: 1 × 340 GB SSD (Boot)
*   __c2.large.arm__: 1 × 480 GB SSD (Boot)
*   __c1.xlarge.x86__:  2 × 120 GB SSD in RAID 1 (Boot) & 1.6 TB of NVMe Flash
*   __c2.medium.x86__: 960 GB of SSD (2 x 480 GB) (1 for Boot)
*   __c3.medium.x86__: 960 GB of SSD (2 x 480 GB) (1 for Boot)
*   __m1.xlarge.x86__:   6 × 480GB SSD (1 for Boot)
*   __m2.xlarge.x86__: 2 × 120 GB SSD (1 for Boot) & 3.2 TB of NVMe Flash
*   __x1.small.x86__:   1 × 240 GB SSD (Boot)
*   __x2.xlarge.x86__: 1 × 120 GB SSD (Boot) , 2 × 240 GB SSD & 3.8 TB of NVMe Flash
*   __n2.xlarge.x86__: 2 × 240 GB SSD in Hardware RAID 1 (Boot) & 3.8 TB of NVMe Flash
*   __g2.large.x86__: 1 x 150 GB SSD (Boot), 2 x 480 GB SSD
*   __s1.large.x86__:  1 x 120 GB SSD (Boot), 2 x 480 GB SSD & 12 X 2 TB HDD.

_Some servers are UEFI only and require an extra step for the CPR configuration. Please check the [last section](#efi-partition-requirement-for-uefi-only-servers) of this article for the details of UEFI only servers._

## Using CPR During Provisioning

Let's say you are going to deploy one of your reserved instances. An example [call to the API](https://www.packet.com/developers/api/devices/) might look like this:

```
curl -X POST -H "X-Auth-Token: token" -H "Content-Type: application/json" -d '
{
  "hardware_reservation_id": "string",
  "hostname": "string",
  "billing_cycle": "string",
  "operating_system": "string",
  "storage": {JSON Object},
  "userdata": "string",
  "tags": ["string"]
}' "https://api.packet.net/projects/{ID}/devices"
```
Note: 'storage' and 'JSON Object' are where you would specifically state your storage configuration requirements.

## Drive Type Name Differences (SATA HDDs, SATA SSDs, and NVMe Flash)
It's worth noting that the OS will use a different naming scheme for NVMe drives compared to standard SSDs and HDDs which are usually seen in the format of `sda`, `sdb` etc. On the other hand, NVMe drives usually follow the naming scheme of `nvme0n1`, `nvme1n1` etc. To get accurate drive names, we suggest that you deploy the server and go into rescue mode (Alpine OS). Then run `fdisk -l` to list all drives.

When partitioning, standard drives are usually followed by a number, so `sda1` and `sda2` while NVMe drives are usually followed by a `p` and number, so it would be `nvme0n1p1` and `nvme0n1p2`.

## t1.small.x86 CPR Example

Using a simple t1.small.x86 to start, the following example shows you how to:

* State which disks you want to format.
* How you want these disks formatted.
* What filesystem should be created.
* Where to mount the partition once created.

```
{
  "disks": [
    {
      "device": "/dev/sda",
      "wipeTable": true,
      "partitions": [
        {
          "label": "BIOS",
          "number": 1,
          "size": 4096
        },
        {
          "label": "SWAP",
          "number": 2,
          "size": "3993600"
        },
        {
          "label": "ROOT",
          "number": 3,
          "size": 0
        }
      ]
    }
  ],
  "filesystems": [
    {
      "mount": {
        "device": "/dev/sda3",
        "format": "ext4",
        "point": "/",
        "create": {
          "options": [
            "-L",
            "ROOT"
          ]
        }
      }
    },
    {
      "mount": {
        "device": "/dev/sda2",
        "format": "swap",
        "point": "none",
        "create": {
          "options": [
            "-L",
            "SWAP"
          ]
        }
      }
    }
  ]
}
```

## m1.xlarge.x86 example
The next exmaple is a slightly more complicated configuration that includes RAID. It's worth noting that RAID created through CPR is software RAID, not hardware RAID.
```
{
   "disks":[
      {
         "device":"/dev/sda",
         "wipeTable":true,
         "partitions":[
            {
               "label":"BIOS",
               "number":1,
               "size":4096
            },
            {
               "label":"SWAPA1",
               "number":2,
               "size":"3993600"
            },
            {
               "label":"ROOTA1",
               "number":3,
               "size":0
            }
         ]
      },
      {
         "device":"/dev/sdb",
         "wipeTable":true,
         "partitions":[
            {
               "label":"BIOS",
               "number":1,
               "size":4096
            },
            {
               "label":"SWAPA2",
               "number":2,
               "size":"3993600"
            },
            {
               "label":"ROOTA2",
               "number":3,
               "size":0
            }
         ]
      }
   ],
   "raid":[
      {
         "devices":[
            "/dev/sda2",
            "/dev/sdb2"
         ],
         "level":"1",
         "name":"/dev/md/SWAP"
      },
      {
         "devices":[
            "/dev/sda3",
            "/dev/sdb3"
         ],
         "level":"1",
         "name":"/dev/md/ROOT"
      }
   ],
   "filesystems":[
      {
         "mount":{
            "device":"/dev/md/ROOT",
            "format":"ext4",
            "point":"/",
            "create":{
               "options":[
                  "-L",
                  "ROOT"
               ]
            }
         }
      },
      {
         "mount":{
            "device":"/dev/md/SWAP",
            "format":"swap",
            "point":"none",
            "create":{
               "options":[
                  "-L",
                  "SWAP"
               ]
            }
         }
      }
   ]
}
```

## m2.xlarge.x86 with RAID and NVMe drive example

This example is more complex than the others as it involves different RAID setups for the ROOT and SWAP partitions as well as mounting the NVMe drive during deployment.

```
{
        "disks": [
            {
                "device": "/dev/sda",
                "wipeTable": true,
                "partitions": [
                    {
                        "label": "BIOS",
                        "number": 1,
                        "size": 4096
                    },
                    {
                        "label": "SWAP",
                        "number": 2,
                        "size": "8G"
                    },
                    {
                        "label": "ROOT",
                        "number": 3,
                        "size": 0
                    }
                ]
            },
            {
                "device": "/dev/sdb",
                "wipeTable": true,
                "partitions": [
                    {
                        "label": "BIOS",
                        "number": 1,
                        "size": 4096
                    },
                    {
                        "label": "SWAP",
                        "number": 2,
                        "size": "8G"
                    },
                    {
                        "label": "ROOT",
                        "number": 3,
                        "size": 0
                    }
                ]
            },
            {
                "device": "/dev/nvme0n1",
                "wipeTable": true,
                "partitions": [
                    {
                        "label": "VAR1",
                        "number": 1,
                        "size": 0
                    }
                ]
            }            
        ],
        "raid": [
            {
                "devices": [
                    "/dev/sda3",
                    "/dev/sdb3"
                ],
                "level": "0",
                "name": "/dev/md/ROOT"
            },
            {
                "devices":[
                   "/dev/sda2",
                   "/dev/sdb2"
                ],
                "level":"1",
                "name":"/dev/md/SWAP"
             }
        ],
        "filesystems": [
            {
                "mount": {
                    "device": "/dev/md/ROOT",
                    "format": "ext4",
                    "point": "/",
                    "create": {
                        "options": [
                            "-L",
                            "ROOT"
                        ]
                    }
                }
            },
            {
                "mount": {
                    "device": "/dev/nvme0n1p1",
                    "format": "ext4",
                    "point": "/var",
                    "create": {
                        "options": [
                            "-L",
                            "VAR1"
                        ]
                    }
                }
            },
            {
                "mount":{
                   "device":"/dev/md/SWAP",
                   "format":"swap",
                   "point":"none",
                   "create":{
                      "options":[
                         "-L",
                         "SWAP"
                      ]
                   }
                }
            }
        ]
    }
```


## EFI Partition Requirement for UEFI only servers

For the c1.large.arm, c2.large.arm, c2.medium.x86, and c3.medium.x86 servers which are UEFI only, you are required to use a FAT32 EFI partition for `/boot/efi` - The default c2.medium.x86 CPR configuration looks like the following:

```
{
		"disks": [
			{
				"device": "/dev/sda",
				"wipeTable": true,
				"partitions": [
					{
						"label": "BIOS",
						"number": 1,
						"size": "512M"
					},
					{
						"label": "SWAP",
						"number": 2,
						"size": "3993600"
					},
					{
						"label": "ROOT",
						"number": 3,
						"size": 0
					}
				]
			}
		],
		"filesystems": [
			{
				"mount": {
					"device": "/dev/sda1",
					"format": "vfat",
					"point": "/boot/efi",
					"create": {
						"options": [
							"32",
							"-n",
							"EFI"
						]
					}
				}
			},
			{
				"mount": {
					"device": "/dev/sda3",
					"format": "ext4",
					"point": "/",
					"create": {
						"options": [
							"-L",
							"ROOT"
						]
					}
				}
			},
			{
				"mount": {
					"device": "/dev/sda2",
					"format": "swap",
					"point": "none",
					"create": {
						"options": [
							"-L",
							"SWAP"
						]
					}
				}
			}
		]
	}
```
