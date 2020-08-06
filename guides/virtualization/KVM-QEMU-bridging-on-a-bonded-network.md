<!-- <meta>
{
    "title":"KVM Qemu Bridging on a bonded network",
    "description":"KVM Qemu Creating a bridged interface on a bonded network",
    "tag":["virtual machines","bonded network","kvm","qemu"],
    "seo-title": "KVM Qemu Bridging on a bonded network - Packet Technical Guides",
    "seo-description": "KVM Qemu Creating a bridged interface on a bonded network",
    "og-title": "KVM Qemu Bridging on a bonded network",
    "og-description": "KVM Qemu Creating a bridged interface on a bonded network"
}
</meta> -->

A bridge is a way to connect two Ethernet segments together in a protocol independentway. Packets are forwarded based on Ethernet address, rather than IP address (like arouter). Since forwarding is done at Layer 2, all protocols can go transparently through abridge.

QEMU (short for Quick Emulator) is a free and open-source hosted hypervisor thatperforms hardware virtualization (not to be confused with hardware-assisted virtualization).

### Prerequisites
* CentOS/Redhat: `yum install bridge-utils` 
* Debian/Ubuntu: `apt-get install bridge-utils`

> **Note:**  This guide will make use of an [elastic IP subnet](https://www.packet.com/developers/docs/network/basic/elastic-ips/) size of `/29`.

Adding the basic bridge configuration to the existing network configuration (Debian/Ubuntu)
example below, you will see `vmbr0` has been added merely as a placeholder

```
auto vmbr0
iface vmbr0 inet static
bridge_ports bond0 bridge_stp off bridge_fd 0
```

With the above bridge place holder included in the bonded network configuration above &
the use of a custom subnet of `/29` we migrate the details of `bond0` (IP etc) to `vmbr0` while keeping everything else in place, see the following example:

```
auto bond0
iface bond0 inet manual
bond-downdelay 200 bond-miimon 100
bond-mode 4
bond-updelay 200 bond-xmit_hash_policy layer3+4 bond-lacp-rate 1
bond-slaves enp2s0 enp2s0d1
auto vmbr0
iface vmbr0 inet static
address 147.75.96.218 netmask 255.255.255.248 gateway 147.75.96.217 bridge_ports bond0 bridge_stp off
bridge_fd 0
dns-nameservers 147.75.207.207 147.75.207.208
```