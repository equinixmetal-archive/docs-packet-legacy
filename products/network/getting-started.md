<!-- <meta>
{
    "title":"Network",
    "description":"Overview of our Network Offerings",
    "tag":["Network", "Private Network"],
    "seo-title": "Bare Metal Network Overview -Packet Developer Docs ",
    "seo-description": "Overview of our Network Offerings",
    "og-title": "Overview",
    "og-description": "Overview of our Network Offerings",
    "og-image": "/images/packet-product-docs.png"
}
</meta> -->

Packet’s network and data center topology is designed with performance and
redundancy as top priorities. Two unique features include a Layer-3 topology and
native dual-stack (IPv4 / IPv6) capability.

With our Layer-3 network design, each server is directly attached to a physical
switch with 2 x 1Gbps copper, 2 x 10Gbps SFP+, or 4 x 10Gbps SFP+ connections.
This provides elastic, cloud-style networking without the slow, latency-inducing
characteristics often associated with complex overlays. For use cases that
require Layer 2 functionality, please check out our [Layer 2
feature](https://www.packet.com/developers/docs/network/advanced/layer-2).

For redundancy, each server has dedicated dual network connections going into
two Top-of-Rack (ToR) switches. These physical connections are virtually bonded
together as follows:

| Server   | Throughput | Port Configuration
| -------- | --------   | -------------
| n2.large | 20 Gbps    | 4 × 10 Gbps (802.3ad/LACP), Quad-port Intel x710
| c3.small | 20 Gbps    | 2 x 10 Gbps (802.3ad/LACP)
| c3.medium| 20 Gbps    | 2 x 10 Gbps (802.3ad/LACP)
| m3.large | 20 Gbps    | 2 x 10 Gbps (802.3ad/LACP)
| s3.large | 20 Gbps    | 2 x 10 Gbps (802.3ad/LACP)
| g2.large | 20 Gbps    | 2 × 10 Gbps (802.3ad/LACP)
| m2.xlarge| 20 Gbps    | 2 x 10 Gbps (802.3ad/LACP), Mellanox ConnectX-4 NICs
| c2.medium| 20 Gbps    | 2 x 10 Gbps (802.3ad/LACP), Mellanox ConnectX NICs
| s1.large | 20 Gbps    | 2 × 10 Gbps (802.3ad/LACP), Mellanox ConnectX NICs
| m1.xlarge| 20 Gbps    | 2 × 10 Gbps (802.3ad/LACP), Mellanox ConnectX NICs
| c1.xlarge| 20 Gbps    | 2 × 10 Gbps (802.3ad/LACP), Mellanox ConnectX NICs
| c1.small | 2 Gbps     | 2 × 1  Gbps (802.3ad/LACP), Intel NICs
| x1.small | 10 Gbps    | 2 x 10 Gbps (mode 5/balance-tlb), Intel X710 NICs
| t1.small | 2.5 Gbps   | 2 × 2.5 Gbps (mode 5/balance-tlb), Intel NICs

___

In **802.3ad** mode, all interfaces send and receive traffic equally.

In **mode 5/balance-tlb** mode, all interfaces send outbound traffic, while only
1 interface, considered the primary NIC, receives inbound traffic at a time. If
the primary NIC were to go down, incoming traffic will seamlessly flow to the
other NIC.

See <https://en.wikipedia.org/wiki/Link_aggregation> for more in depth
information.
