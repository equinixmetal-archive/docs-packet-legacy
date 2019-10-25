<!--<meta>
{
    "title":"Layer 2 on x1.small",
    "description":"How to configure layer 2 on x1.small",
    "date": "2019/10/25",
    "tag":["layer 2", "networking", "advanced", "x1.small"]
}
</meta>-->

Our Layer 2 feature on the x1.small (which is found in our 11 custom locations) has some differences in both scope and implementation when compared to our other supported machines.

## #1 - Create a VLAN in your Packet Project

The x1.small will need at least one Ethernet port connected to a VLAN network for layer 2
connectivity. VLANs can be created via the "IPs and Networks" tab in your Packet project,
and under "Layer 2".

![create-vlan](images/layer-2-on-x1.small/create_vlan.jpg)