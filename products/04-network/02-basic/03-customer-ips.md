<!--<meta>
{
    "title":"BYO IP: Bring Your Own IP",
    "description":"utilizing your own ASN on Packet",
    "tag":["Network", "IPs", "Anycast"]
}
</meta>-->

Packet allows customers to announce their own IP space, in a block of /24 or greater IPv4 space or /48 or larger IPv6 space on the Packet network.  You can read up on CIDR notation here to understand about the IP block sizes.  

There are two ways a customer can Bring Their Own IPs to Packet:

#### Custom Elastic IPs

Once setup and working on Packet, customers can then use these IP addresses as Elastic IP’s within a Packet project (announced out of a single Packet datacenter location).  If a customer wishes to use some of their IP space as an Anycast announcement, please see the section on Anycast below.

It is worth noting that we do not support using Custom IP space for server addresses (e.g. the primary IP’s assigned during installation for each server instance).  Custom IP’s can only be used as Elastic Addresses at this time.

#### BGP Announcement

Customers with their own IP space can announce their IPs through us provided that their ASN and the IP block in question match in the IRR/RADb.   If a customer utilizes [BGP to announce their addresses](https://www.packet.com/developers/docs/network/advanced/local-and-global-bgp/), they will need to run BGP on each server that needs an address from that pool assigned to it.  They may also build their own Anycast network on top of Packet by announcing the same block of IPs (minimum /24) in multiple facilities simultaneously.
Who is it for?

#### Pricing 

No setup or monthly fee for utilizing your own subnet on Packet's platform.