<!--<meta>
{
    "title":"Network: Overview",
    "description":"Overview of our Network Offeringst",
    "date": "09/20/2019",
    "tag":["Network", "Private Network"]
}
</meta>-->



### Network Design Overview

Packet’s network and datacenter topology is designed with performance and redundancy as top priorities. Two unique features include a full Layer-3 topology and a native dual-stack (IPv4 / IPv6) capability.

With a pure Layer-3 network design, each server is directly attached to a physical switch via either 2 x 1Gbps copper or 2 x 10Gbps SFP+ connections - providing elastic, cloud-style networking without the slow, latency-inducing characteristics often associated with overlays and Layer-2 vLans.

Each server has dedicated dual network connections going into two Top-of-Rack (ToR) switches. These two physical connections are virtually bonded together as follows:


| Type  | Network |
| ------------- | ------------- |
| t1.small|  1 Gbps Network (2 × Intel NICs 1Gbps w/ TLB) full hardware redundancy but no active/active bond.
| c1.small|  2 Gbps Bonded Network (2 × Intel NICs 1Gbps w/ LACP) full hardware redundancy and active/active bond.
| x1.small| 10 Gbps Network (Intel X710 NIC)
| m1.xlarge| 20 Gbps Bonded Network (2 × Mellanox ConnectX NICs, 10Gbps w/ LACP) full hardware redundancy and active/active bond.
|c1.xlarge| 20 Gbps Bonded Network (2 × Mellanox ConnectX NICs, 10Gbps w/ LACP) full hardware redundancy and active/active bond.
|s1.large|20 Gbps Bonded Network ( 2 × Mellanox ConnectX NICs, 10 Gbps w/ LACP) full hardware redundancy and active/active bond.
|m2.xlarge| 20Gbps Network Pipe with 2 x 10 Gbps Bonded NICs in an HA configuration (2 x 10Gbps Mellanox Connect-X 4 NICs)
|c2.medium| 20Gbps Network Pipe with 2 x 10 Gbps Bonded NICs in an HA configuration (2 x Mellanox ConnectX NICs)
|g2.large| 20Gbps Bonded Network 2 × 10GBPS W/ LACP
|n2.large| Quad-port Intel x710  (4 × 10GBPS W/ LACP)


#### IP Space, Elastic IPs, Global Anycast IPs and Backend Networking

##### Default IPv4 and IPv6 Addresses
 Packet servers are grouped into projects to support backend networking and ease of collaboration. When you create a new project, our platform assigns two IP blocks: a per-facility /56 IPv6 and /25 Private IPv4.

When you then deploy servers into a project, each machine gets 1 Public IPv4 from Packet’s general pool, as well as 1 Private IPv4 and 1 IPv6 from the blocks already assigned to the project. Note: since the Public IPv4 for each server is assigned from our general pool, you will lose this IPv4 if you delete your server (see elastic addressing section below for how to keep IPs around).

##### Elastic IPs
Elastic IPs (IPv4 only) can be requested via the portal or API, and once assigned are instantly routable to any server within your project based upon location. They cost $0.005/hr ($3.60/mo) per IP. 

We recommend using Elastic IPs for any workload where permanent reachability is required since these IPs can be retained and reused even if you add or remove specific servers. For example, hosting a public-facing web site behind a load balancer, or directing clients to a clustered database server internally. Move IPs from one server to another if one fails, or move workload to a bigger (or smaller!) server to respond to traffic demands.

Elastic IPs can also be used as additional IPs that you can attach to a server. This is useful if you need additional IP space on a server for containerized or virtualized workloads, where every VM might need a direct connection to the public internet, without the need of NAT-ing and extra routes.

##### Global Anycast IPs
Can be requested via the portal or API. There is a hard limit of four (4) IPs per project. You can then announce your IP space via Local BGP & utilizing bird. Global Anycast IPs can be announced through all of our core sites with Custom sites coming soon.  Each Global Anycast IP costs $0.15/hour. For example, a /31 (two usable IPs) would cost $0.30/hr. Bandwidth is also a consideration as, regular $0.05/GB outbound rates will apply. In addition, inbound bandwidth to Global Anycast IPs will be $0.03/GB.

##### Private Networking
All servers within a Project can talk to each other via private RFC1918 address space (e.g. 10.x.x.x), but cannot communicate over private address space by devices outside of that Project.  

The only restriction is that all servers must be within a single project. Private networking works within a single datacenter. 

##### Backend Transfer
Enables you to communicate between facilities & projects within your account. This is done via private RFC1918 address space (e.g. 10.x.x.x). Backend connectivity within the same facility does not incur charges for bandwidth, as it does not leave the facility. However, should you connect between facilities this would incur a fee of $0.03/GB. Learn more about backend transfer here. 

###### Backend & Private Network Security

We secure this private communication with ACL restrictions applied to the switch ports of the servers. This way only the servers that are part of the same project or ORG (if using backend transfer) are able to talk to each other via private IPs.

Packet's "bonded" network interfaces
The network interfaces on our servers work a little bit different than what you might be accustomed to at other data centers. Servers are installed with a single logical interface, 'bond0', which contains three types of IP addresses:

    A public IPv4 address
    A private IPv4 address
    A public IPv6 address

We are running LACP (mode 4 in Linux bonding parlance) on our production NIC's. Each server also has a dedicated "out of band" NIC for management functionality, such as IPMI and virtual console. Using this configuration, we're able to deliver on both private networking *and* high availability, using our dual (1G or 10G) NIC hardware platform. Servers are connected to a redundant pair of custom switches, for maximum fault tolerance.

If an entire switch experiences a hardware failure or undergoes scheduled software upgrades, capacity is effectively "halved" (you'll drop down to a single 1G or 10G link), however, network connectivity will remain intact—save perhaps for a fail-over period lasting several seconds or less.

Likewise, all upstream backbone hardware inside the Packet data center is deployed as "active/active", in that we can lose a single device in any role without any outage. As we are using sFlow for traffic accounting, and not conventional (SNMP) port counters, we are able to only bill customers for Internet-bound traffic, and not inter-machine traffic—even in cases where both public and private traffic passes over the same physical NIC's.

Bandwidth to all Packet customers enjoys free inbound traffic, free traffic between servers in the same Packet project (within the same datacenter location).

We aggressively peer with a wide variety of content providers and eyeball networks and feel that our network can appropriately be described as “premium.”Outbound traffic to the Internet (including to other Packet data center locations is charged at the following rates the default rate of $0.05/GB.
