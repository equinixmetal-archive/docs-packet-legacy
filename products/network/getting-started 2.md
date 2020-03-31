<!-- <meta>
{
    "title":"Overview",
    "description":"Overview of our Network Offerings",
    "tag":["Network", "Private Network"],
    "seo-title": "Bare Metal Network Overview -Packet Developer Docs ",
    "seo-description": "Overview of our Network Offerings",
    "og-title": "Overview",
    "og-description": "Overview of our Network Offerings"
}
</meta> -->



Packet’s network and datacenter topology is designed with performance and redundancy as top priorities. Two unique features include a Layer-3 topology and native dual-stack (IPv4 / IPv6) capability.

With our Layer-3 network design, each server is directly attached to a physical switch via either 2 x 1Gbps copper or 2 x 10Gbps SFP+ connections. This provides elastic, cloud-style networking without the slow, latency-inducing characteristics often associated with complex overlays. For use cases that require Layer 2 functionality, please check out our [Layer 2 feature](https://www.packet.com/developers/docs/network/advanced/layer-2).

For redundancy, each server has dedicated dual network connections going into two Top-of-Rack (ToR) switches. These two physical connections are virtually bonded together as follows:


| Type  | Network |
| ------------- | ------------- |
| t3.small|  20 Gbps Bonded Network (2 x 10Gbps Ports w/ LACP)
| c3.small|  20 Gbps Bonded Network (2 x 10Gbps Ports w/ LACP)
| c3.medium| 20 Gbps Bonded Network (2 x 10Gbps Ports w/ LACP)
| m3.large| 20 Gbps Bonded Network  (2 x 10Gbps Ports w/ LACP)
| s3.large| 20 Gbps Bonded Network  (2 x 10Gbps Ports w/ LACP)
| t1.small|  2.5 Gbps Network (2 × Intel NICs 2.5Gbps w/ TLB) full hardware redundancy but no active/active bond.
| c1.small|  2 Gbps Bonded Network (2 × Intel NICs 1Gbps w/ LACP) full hardware redundancy and active/active bond.
| x1.small| 10 Gbps Network (2 x Intel X710 NICs 10 Gbps w/ TLB) full hardware redundancy but no active/active bond.
| m1.xlarge| 20 Gbps Bonded Network (2 × Mellanox ConnectX NICs, 10Gbps w/ LACP) full hardware redundancy and active/active bond.
|c1.xlarge| 20 Gbps Bonded Network (2 × Mellanox ConnectX NICs, 10Gbps w/ LACP) full hardware redundancy and active/active bond.
|s1.large|20 Gbps Bonded Network ( 2 × Mellanox ConnectX NICs, 10 Gbps w/ LACP) full hardware redundancy and active/active bond.
|m2.xlarge| 20Gbps Network Pipe with 2 x 10 Gbps Bonded NICs in an HA configuration (2 x 10Gbps Mellanox Connect-X 4 NICs)
|c2.medium| 20Gbps Network Pipe with 2 x 10 Gbps Bonded NICs in an HA configuration (2 x Mellanox ConnectX NICs)
|g2.large| 20Gbps Bonded Network 2 × 10GBPS W/ LACP
|n2.large| Quad-port Intel x710  (4 × 10GBPS W/ LACP)
