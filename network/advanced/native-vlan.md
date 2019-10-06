
<!--<meta>
{
    "title":"Native VLAN",
    "description":"Setting up Native VLAN",
    "tag":["VLAN", "Layer2"]
}
</meta>-->

Native VLAN feature enables support for untagged packets when multiple VLANs are configured on the server port.

When multiple VLANs are configured on the server port, the Native VLAN feature allows assigning one of the VLANs as native VLAN, so the packets destined for the native VLAN will always go out as untagged packets. Similarly, when the server port receives packets that are untagged, it will automatically be construed as belonging to native VLAN. This is currently supported only on non-bonded interfaces.

The Native VLAN feature is supported on servers with the 2-port NIC. Upon provisioning, all servers are set to the Layer 3 networking mode by default. The 2-port NIC is configured with a single bond, namely bond0, with both interfaces eth0 and eth1 as members of the bond. Support for this feature on 4-port NIC server such as n2.xlarge.x86 is planned.

Assigning VLANs onto the server, the server network mode needs to be changed to either Layer-2 only on Mixed Layer 2/Layer 3. In the Layer-2 only mode, VLANs can be assigned to either of the interfaces, with one of the VLANs marked as "native". But, in the mixed Layer 2/Layer 3 mode, VLANs can be assigned to only the eth1 interface which is outside of the bond0 interface.

In order to set a VLAN as "native", click on the "Manage"; button next to it and follow the instructions.

![assign VLAN](/images/native-vlan/Assign-VLAN.png)

![manage VLAN](/images/native-vlan/Manage-VLAN.png)

![set to native VLAN](/images/native-vlan/Set-VLAN-To-Native.png)

The native VLAN feature is also supported through the [API](https://gist.github.com/usrdev/347ccb21372da862c92c00035e4bf5a5)
