<!-- <meta>
{
    "title":"ECX Interconnection",
    "description":"Setting Up & Using ECX Interconnection",
    "tag":["Network", "ECX", "Interconnection"],
    "seo-title": "ECX Interconnection - Packet Developer Docs",
    "seo-description": "Setting Up & Using ECX Interconnection",
    "og-title": "ECX Interconnection",
    "og-description": "Setting Up & Using ECX Interconnection",
    "og-image": "/images/packet-product-docs.png"
}
</meta> -->

ECX Interconnection is a software-defined interconnection service that enables any business to connect between its own distributed infrastructure and any other businesses', including the world's largest network service and cloud providers, on Platform Equinix. On Packet, ECX accepts ingress connections only.  


### Availability  

ECX Connections are powered by Equinix ECX Fabric and are available in the following IBX Locations: NY5, DC13, SV15. 

### Billing

Charges for interconnections will be billed to your ECX Fabric account, separate from your Packet bill. 


### Setup ECX on Packet
Setting up the ECX interconnection is completed in three steps. 

* Setting up connection in Packet Portal 
* Setting up connection in ECX Portal 
* Finalizing Connection, attach the VLAN


## Setting up connection in Packet Portal 
In the Packet portal you will find ECX Interconnections under IPs & Networks

![ECX Selector](/images/ecx/diy-ecx-interconnection-choose.png)

from its landing page click 'Request New Connection'.

![Request ECX Connection](/images/ecx/ecx-new-connection.png)

Choose the preferred IBX & a connection name.

![ECX Details](/images/ecx/ecx-connection-request.png)

The Packet Portal ECX Connection has successfully been submitted and is awaiting review by our support team.

![ECX Connection Success](/images/ecx/ecx-success-connection.png)

> **_NOTE:_** Retain the ECX token, as it is required to complete the setup process in the [ECX Portal](https://ecxfabric.equinix.com/dashboard).





## Setting up connection in ECX Portal

Now, onto the [ECX portal](https://ecxfabric.equinix.com/dashboard) to begin the connection setup. 

From the Dashboard, click 'Create Connection'

![ECX Dashboard](/images/ecx/ecx-dashboard.png)

From 'I want to connect to:' click 'A Service Provider' and search for or click on Packet. 

![ECX Connect To](/images/ecx/ecx-connect-to.png)

With Packet selected proceed to 'Create Connection'
![Packet ECX Services](/images/ecx/ecx-packet-services.png)

From Select Locations choose 'Port' or 'Virtual Device'. Along with choosing an IBX & connection Destination. 

![ECX Port](/images/ecx/ecx-portal-connection-setup.png)

From Connection Details set 'Connection Information' including its preferred name, and VLAN ID. The ECX Token of which was generated/shown during the Packet Portal configuration process will also be required for this step. Lastly, choose the connection speed for your connection.



![ECX Connection Details](/images/ecx/ecx-connection-details.png)

Then final review screen will provide your full connection details, it will also allow you to rollback and correct any errors. If all is well, proceed with 'Submit your Order'. After this, the order has been submitted. There could be a slight delay complete your connection request. Typically this is verified, processed and completed with a business day, usually sooner. 

## Finalizing Connection, Adding VLAN
With the connection configuration complete, the last step is to return to the ECX Portal and attach the VLAN. To ensure the connection is ready for this final step, review the ECX Connections in the Packet Portal for a message of 'Waiting for Customer VLAN'. 
 

Do reach out to our [support team](https://support.packet.com/hc/en-us) should you need assistance. 