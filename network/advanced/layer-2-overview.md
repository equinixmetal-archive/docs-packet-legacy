<!--<meta>
{
    "title":"Layer 2 Overview",
    "description":"A quick look at the layer 2 feature.",
    "date": "2019/09/20",
    "tag":["layer 2", "networking", "advanced"]
}
</meta>-->

**Feature Overview**

Our network is designed around a pure Layer 3 network topology, where we bring a routed interface to each server.  However, many environments expect a Layer 2 network. To support these use cases we’ve developed a feature that allows users to create and connect Layer 2 networks to their Packet infrastructure.

A few notes to help set the stage:

* availability in all datacenters,
* available on all server types except our t1.small & c1.small,
* virtual networks are confined to a single datacenter.
* There are no fees for the use of the Layer 2 feature.


**Network configuration types**

When converting from layer 3 to another network type there are 3 possible configurations to choose from: hybride mode, bonded layer two, or layer 2 with a broken network bond.

In hybrid mode only one network interface is removed from bond and placed in layer two mode. VLANs can then be attached to this interface for Layer 2 connectivity. This preserves layer 3 connectivity to the server via bond0, so it can be accessed via the public IP.

Bonded Layer 2 converts the bonded network interface to pure Layer 2 mode. This means all access to the public internet is lost, and the host can only be reached by the Serial Over SSH (SOS) console. In this configuration the network bond is intact, so only one network interface will be available for attaching VLANs.

Layer two with a broken bond is similar to the bonded Layer 2 configuration, except the network bond is also dismantled, thus, providing two network interfaces available for VLANs.

Note: both pure Layer 2 networking configurations will permanently remove the server's IP management IP addresses. If the server is later converted back to Layer 3, new IP addresses will be assigned.


**Reverting to Layer 3 from Layer 2**

Reverting from Layer 2 to Layer 3 via the portal only require changing the networking mode via the server's networking page. Our API will automatically bond the network interfaces and assign a new IP address.

**Functional Description**


In the portal server configuration screen, the switch ports serving each of your servers' NICs may be independently enabled to switch one or more of your provisioned networks.

If only one VLAN is enabled on a port, packets are untagged. This means that the server's network configuration does not need to be VLAN-aware. However when two or more VLANs are enabled on a port, then packets are tagged and therefore it will be necessary to configure the server's networking accordingly.

**Layer 2 Setup in the Packet Portal**

Layer 2 networking is enabled in the Packet Portal from the project's "IPs and Networks" tab.

Under "Layer 2" you can add one or more networks like this:

![add VLAN jpg](https://raw.githubusercontent.com/packethost/docs/master/images/layer-2-overview/add-vlan.jpg "Add a VLAN")

Note that networks are local to a specific data center and that the assigned VLAN ID displayed here will be used to configure server port switching and server network setup.

When you add a network, we automatically provision it in our data center switches; however, in order for it to be made available to individual machines additional steps are required.

1. Convert the server's networking mode. This will configure the server to allow attachment of your server's network interfaces to your VLAN. You can choose a mix/hybrid pure Layer 2 (with the option to break the bond or leave it intact).

![convert network jpg](https://raw.githubusercontent.com/packethost/docs/master/images/layer-2-overview/convert-network-mode.jpg "Convert network type")

2. Once the network mode has been changed you will see the option to attach a new VLAN.

![attach VLAN jpg](https://raw.githubusercontent.com/packethost/docs/master/images/layer-2-overview/attach-vlan-step1.jpg "Attach a VLAN")

3. Choose the network interface you wish to attach the VLAN to, but be aware that you should only choose "bond0" if you have converted the server to the bonded layer 2 networking mode.

![VLAN menue jpg](https://raw.githubusercontent.com/packethost/docs/master/images/layer-2-overview/attach-vlan-step2.jpg "Attach VLAN slide-out")
