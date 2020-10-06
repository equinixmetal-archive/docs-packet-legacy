<!-- <meta>
{
    "title":"Equinix Fabric",
    "description":"Setting Up & Using Equinix Fabric",
    "tag":["Network", "Fabirc", "Equinix"],
    "seo-title": "Equinix Fabric - Equinix Metal Devloper Docs",
    "seo-description": "Setting Up & Using Equinix Fabric",
    "og-title": "Equinix Fabric",
    "og-description": "Setting Up & Using Equinix Fabric",
    "og-image": "/images/edge-metal-product-docs.png"
}
</meta> -->

Equinix Fabric is a software-defined interconnection service that enables any business to connect between its own distributed infrastructure and any other businesses', including the world's largest network service and cloud providers, on Platform Equinix. On Edge Metal, Fabric accepts ingress connections only.  


### Availability  

Fabric Connections are available in the following IBX Locations: NY5, DC13, SV15. 

### Billing

Charges for Fabric will be billed to your Equinix Fabric account, separate from your Edge Metal bill.


### Setup Equinix Fabric on Edge Metal
Setting up Fabric is completed in three steps. 

* Setting up connection in Edge Metal Portal 
* Setting up connection in Equinix Portal 
* Finalizing Connection, attach the VLAN


## Setting up connection in Edge Metal Portal 
In the Edge Metal portal you will find `Connections` under IPs & Networks

from its landing page click 'Request New Connection'.

![Request Fabric Connection](/images/fabric/fabirc-new-connection.png)

Choose the preferred IBX & a connection name.

![Fabric Details](/images/fabric/fabric-connection-request.png)

The Edge Metal Connection has successfully been submitted and is awaiting review by our support team.

![Connection Success](/images/fabric/fabric-success-connection.png)

> **_NOTE:_** Retain the Fabric token, as it is required to complete the setup process in the [Fabric Portal](https://ecxfabric.equinix.com/dashboard).



## Setting up connection in Equinix Fabric Portal

Now, onto the [Equinix Fabric portal](https://ecxfabric.equinix.com/dashboard) to begin the connection setup. 

From the Dashboard, click 'Create Connection'

![Fabric Dashboard](/images/fabric/fabric-dashboard.png)

From 'I want to connect to:' click 'A Service Provider' and search for or click on Edge Metal. 

![Fabric Connect To](/images/fabric/fabric-connect-to.png)

With Edge Metal selected proceed to 'Create Connection'
![Edge Metal](/images/fabric/fabric-edge-metal-services.png)

From Select Locations choose 'Port' or 'Virtual Device'. Along with choosing an IBX & connection Destination. 

![Fabric Port](/images/fabric/fabric-portal-connection-setup.png)

From Connection Details set 'Connection Information' including its preferred name, and VLAN ID. The Fabric Token of which was generated/shown during the Edge Metal Portal configuration process will also be required for this step. Lastly, choose the connection speed for your connection.



![Connection Details](/images/fabric/fabric-connection-details.png)

Then final review screen will provide your full connection details, it will also allow you to rollback and correct any errors. If all is well, proceed with 'Submit your Order'. After this, the order has been submitted. There could be a slight delay complete your connection request. Typically this is verified, processed and completed with a business day, usually sooner. 

## Finalizing Connection, Adding VLAN
With the connection configuration complete, the last step is to return to the Fabric Portal and attach the VLAN. To ensure the connection is ready for this final step, review the Connections in the Edge Metal Portal for a message of 'Waiting for Customer VLAN'. 
 

Do reach out to our [support team](https://support.equinixmetal.com/hc/en-us) should you need assistance. 