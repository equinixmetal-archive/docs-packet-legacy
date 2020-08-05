<!-- <meta>
{
    "title":"Global Anycast IPs",
    "description":"Obtaining & Utilizing Global Anycast IPs",
    "tag":["Network", "Elastic IPs", "Anycast"],
    "seo-title": "Global Anycast IPs - Packet Developer Docs",
    "seo-description": "Obtaining & Utilizing Global Anycast IPs",
    "og-title": "Overview",
    "og-description": "Obtaining & Utilizing Global Anycast IPs",
    "og-image": "/images/packet-product-docs.png"
}
</meta> -->


Global Anycast IPs are public IPv4 addresses pulled from Packet-owned IP space and announced in all of our core facilities (custom sites coming soon). This allows you to perform Anycast without having to go through the effort of registering your own AS.

When using global IPs, they are similar to normal facility-bound elastic IPs, and can be assigned to servers statically via our portal/API, or they can be announced and moved between servers via Local BGP.


**Please Note:** If you wish to announce your global IPv4 addresses via BGP, you need to enable Local BGP, not Global BGP. You should only use Global BGP if you have your own AS and want to announce your own IP space at Packet.

#### How much do Global Anycast IPs cost?

Like normal Elastic IPs, Global Anycast IPs are charged on a usage basis. Each Global Anycast IP costs $0.15/hour. If you request a larger subnet, you'll pay for each of those IPs. For example, a /31 (two IPs) will cost $0.30/hr.

Bandwidth is also a consideration. Regular $0.05/GB outbound rates apply. In addition, inbound bandwidth to Global Anycast IPs costs $0.03/GB.

#### Which facilities support Global Anycast IPs?

Global Anycast IPv4 addresses can be announced from Packet's core datacenters those are: SIN3, IAD2, AMS1, NRT1, DFW2, EWR1 and SJC1.

How many Global Anycast IPs can you request?

You can request up to 4 Global Anycast IPs per project:

/30 - 4 usable IPv4 addresses
/31 - 2 usable IPv4 addresses
/32 - 1 usable IPv4 address

#### How do you request Global Anycast IPs?

Global Anycast IPs are requested through the client portal by browsing to the _"IPs & Networks"_ section within a project and selecting _"IPs" > "Request More IP Addresses"_.

In the slide-out, you can select Global IPv4 and choose the quantity you wish to request. It's helpful to share a few words about your use case and then click "Submit Request".

#### How do I use Global Anycast IPs?

Once you have been allocated your Global Anycast IPv4 address block, you can assign or announce individual /32s from that block in each facility. Click the "Manage" button on your global block to view the status of each individual global IPv4 address.

A grey circle indicates that the IP is not bound in the facility or being announced via BGP. A green circle indicates it is. If you do not announce or bind a global IP in one facility, we will backhaul that traffic to the next closet facility where the IP is announced. This incurs cost, which is why there is a charge for inbound transfer.

#### How do I setup Global Anycast IPs?

If you are announcing your Global Anycast IPs via BGP, simply add the IP to your bird configuration, restart bird, and then bind the global IPv4 address to lo as you would any other elastic IP.  For example:

```
bird.conf

filter packet_bgp {
  # the IP range(s) to announce via BGP from this machine
  if net = 147.75.108.90/32 then accept;
}

# the rest of your bird configuration below
```

Restart bird: `service bird restart`

Bind IP locally:

`ip a add 147.75.108.90/32 dev lo`

Verify it works:

```
$ ping -c 1 147.75.108.90
PING 147.75.108.90 (147.75.108.90): 56 data bytes
64 bytes from 147.75.108.90: icmp_seq=0 ttl=60 time=9.845 ms

--- 147.75.108.90 ping statistics ---
1 packets transmitted, 1 packets received, 0.0% packet loss
round-trip min/avg/max/stddev = 9.845/9.845/9.845/0.000 ms
```

If you are not using BGP and instead wish to bind the global IPs statically via the elastic IP method, simply select Global IPv4 from the dropdown, choose your global IPv4 block, and assign individual /32s from there.

You can bind individual /32s to a single device in each facility that supports global IP when using the elastic IP method. If you attempt to bind the same elastic IP to more than one device in the same facility, you will see an error:

BGP does not have this limitation, and as such we recommend using BGP for HA applications.

After you have assigned the global IP to your device, bind it locally and verify that it works.

Bind IP locally:

`ip a add 147.75.108.90/32 dev lo`

Verify that it works:

```
$ ping -c 1 147.75.108.90
PING 147.75.108.90 (147.75.108.90): 56 data bytes
64 bytes from 147.75.108.90: icmp_seq=0 ttl=60 time=9.845 ms

--- 147.75.108.90 ping statistics ---
1 packets transmitted, 1 packets received, 0.0% packet loss
round-trip min/avg/max/stddev = 9.845/9.845/9.845/0.000 ms
```

You're now all set to deploy your Anycast application!
