<!--<meta>
{
    "title":"Local and Global BGP",
    "description":"Using BGP Global/Local on Packet",
    "tag":["BGP", "BGP Local", "BGP Global"]
}
</meta>-->

# Local and Global BGP
Packet supports BGP ([Border Gateway Protocol](https://en.wikipedia.org/wiki/Border_Gateway_Protocol)) for advertising routes to Packet servers in a local environment (called Local BGP), as well as to the greater Internet (called Global BGP).

BGP's features require you to run a BGP speaking routing client, such as [BIRD](http://bird.network.cz/?get_doc&f=bird.html), Quagga or ExaBGP on your server. This routing client will control route advertisements via a BGP session to Packet's upstream routers. Packet will learn the routes that you are advertising and appropriately send traffic to your server(s).

## Local BGP versus Global BG
In a Local BGP deployment, a customer uses an internal ASN
([Autonomous System Number](https://en.wikipedia.org/wiki/Autonomous_system_(Internet)) to control routes within a single Packet datacenter. This means that the routes are never advertised to the global Internet and the customer does not need to pay for or maintain a registered ASN with a Regional Internet Registry (RIR) like ARIN, APNIC or RIPE. The top use case for operating local BGP would be to perform failover or IP mobility between a collection of servers in a local datacenter. Global BGP, on the other hand, requires a customer to have a registered ASN and IP space.

## Default BGP Route  
When utilizing virtual routing software (e.g. VyOS, OpnSense, etc) this would allow you to see all the routes learned instead of creating them statically. This can be set up utilizing [Terraform](https://www.terraform.io/docs/providers/packet/r/bgp_session.html), or directly through our customer portal, as shown below.

![enable default route 1](/images/bgp/Enable-Default-Route-1.png)

![enable default route 2](/images/bgp/Enable-Default-Route-2.png)    

## Communities Supported
If you are interested in utilizing BGP communities, there is an in depth guide that lists all of the supported communities [here](/guides/BGP-global-communities.md).


## Getting Started
To get started, please create a Project in the Packet portal or navigate to an existing project that you'd like to enable for BGP support. Click on the IPs & Networks tab and navigate to the BGP request form (as shown below.

On the form, select either Global BGP or Local BGP. For Local BGP we default to using a private ASN of 65000. If you choose Global BGP, please enter your own public ASN. You may then enter an MD5 password for your BGP session. This is optional but highly recommended.

![enable BGP at project level 1](/images/bgp/Enable-BGP-Project-1.png)

Once you submit the request, Packet will review the details and get back to you shortly (usually in 24-48 hours). We will contact  when BGP has been enabled, or if we need more information, and will then see your BGP details show up in the IPs & Networks tab, as follows:

![enable BGP at project level 2](/images/bgp/Enable-BGP-Project-2.png)

Additionally, you will see some extra options to enable or disable IPv4 and IPv6 BGP on the management pages for server in your BGP enabled project.

![enable BGP at server level](/images/bgp/Enable-BGP-Server.png)️

Note: Do not assign the subnet to any server, as that will create a static route thus causing an issue with the BGP setup.
