<!-- <meta>
{
    "title":"Device Tagging",
    "description":"Create Device Tags",
    "tag":["API", "Tagging", "Device Tagging"],
    "seo-title": "Device Tagging - Packet Developer Docs",
    "seo-description": "Create Device Tags",
    "og-title": Device Tagging",
    "og-description": "Create Device Tags",
    "og-image": "/images/packet-product-docs.png"
}
</meta> -->


Tagging is a feature allowing you to apply custom labels to a single device or multiple devices. Device tagging is purely for filtering purposes at this time.

Tagging is avaible through our customer portal & API. To create, edit, and remove tags via the portal you will go to the device view page and then click on tags.


![device-tagging](/images/device-tagging/device-tagging-1.png)

![device-tagging](/images/device-tagging/device-tagging-2.png)



If you work directly with the API. An example of what payload may look like. This ayload would create a device in `EWR1` with CentOS as the OS and also tag it with `my_tag`, and `my_tag_2`. It will also lock the device to avoid it from being deleted.

````
{ "plan: "baremetal_1".
"operating_system:" "centos",
"facility": "ewr1",
"tags": ["my_tag","my_tag_2"],
"locked": true
}
````
To delete/change tag via API the payload would look like:

````
{        "hostname": "newhostname.server.com",
          "description": "Server description",
          "tags": ["new_tag", "server"],
          "billing_cycle": "monthly",
          "locked": true,
      }

````
