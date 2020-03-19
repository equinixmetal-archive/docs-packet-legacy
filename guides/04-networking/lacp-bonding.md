<!-- <meta>
{
    "title":"LACP Bonding",
    "description":"Learn how to setup aggregated grups that share the same bond link and speed",
    "tag":["Route LACP", "Bonding"],
    "seo-title": "LACP Bondingt - Packet Technical Guides",
    "seo-description": "Learn how to setup aggregated grups that share the same bond link and speed.",
    "og-title": LACP Bonding",
    "og-description":"Learn how to setup aggregated grups that share the same bond link and speed"  
}
</meta> -->

Each of the “dual NIC” Linux servers provisioned through Packet have their network interfaces bonded together using the Link Aggregation Control Protocol (LACP).  The current t1.small machines have a Balance-tlb bonding, mainly due to limitations on the Atom CPUs. On this bonding mode, only one slave is in use, so if it fails, the second takes over.

Bonding, also called link aggregation, is the process of combining several network interfaces (NICs) into a single link.  This provides various potential benefits, including high availability, load balancing, maximum throughput, or a combination of these.


### Definition and Configuration
The LACP bond, as specified by IEEE 802.3ad: Dynamic link aggregation. Creates aggregation groups that share the same speed and duplex settings. Utilizes all slaves in the active aggregator according to the 802.3ad specification.

**An example of the bond configuration:**
```
cat /proc/net/bonding/bond0
Ethernet Channel Bonding Driver: v3.7.1 (April 27, 2011)
Bonding Mode: IEEE 802.3ad Dynamic link aggregation
Transmit Hash Policy: layer3+4 (1)
MII Status: up
MII Polling Interval (ms): 100
Up Delay (ms): 200
Down Delay (ms): 200
802.3ad info
LACP rate: fast
Min links: 0
Aggregator selection policy (ad_select): stable
System priority: 65535
System MAC address: 0c:c4:7a:86:35:b0
Active Aggregator Info:
Aggregator ID: 1
Number of ports: 2
Actor Key: 9
Partner Key: 12
Partner Mac Address: 9c:cc:83:50:1d:a0
```

### Transmit Hash Policy
Something important on that configuration is the Transmit Hash Policy: layer3+4 option, which is a balancing algorithm mode. layer3+4 is a policy that uses upper layer protocol information, when available, to generate the hash. This allows for traffic to a particular network peer to span multiple slaves, although a single connection will not span multiple slaves.

**Note:** Transmit Hash Policy is used in the slave selection only for outgoing traffic.  This means that you will be able to use the full network bandwidth when creating multiple connections.


### Iperf Implications
When testing bandwidth throughput with iperf, it will use ONLY 1 interface on the client, hence, only half of the total bandwidth. But, if you test it with 1 master, and 2 clients, you will be able to see the full bandwidth used on the master.
