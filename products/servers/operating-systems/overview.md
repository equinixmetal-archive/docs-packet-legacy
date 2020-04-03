<!-- <meta>
{
    "title":"Operating Systems",
    "description":"Learn more about operating systems at Packet",
    "tag":["Operating Systems"],
    "seo-title": "Operating Systems Overview - Packet Developer Docs ",
    "seo-description": "Learn more about operating systems at Packet",
    "og-title": "OS Overview",
    "og-description": "Learn more about operating systems at Packet"
}
</meta> -->



Packet provides a range of officially supported operated systems including Linux, BSD, Windows, and VMware distributions.

Images for supported operating systems are built specifically for each Packet server type and stored on our public [Github repository](https://github.com/packethost/packet-images). All supported operating systems are available for automatic installation when provisioning Packet servers via the customer portal, Packet API, or integration (e.g. Terraform).

Visit our [main webpage](https://www.packet.com/developers/os-compatibility/) for a list of all supported operating systems and compatible server types.

### Custom iPXE
Don't see the OS you need in our supported list? No problem!

With [custom iPXE](https://www.packet.com/developers/docs/servers/operating-systems/custom-ipxe/) you can bring your own Operating System image. Just choose iPXE as the OS when provisioning any Packet server type, and you'll be able to supply a URL to PXE installation tools like netboot.xyz, or your own iPXE script.

### Custom Images
Our supported operating system images are designed for speed and efficiency, but that means they include a minimum number of packages. To help automate the provisioning process for our customers, and reduce time spent manually configuring fresh installs, we provide the option to tailor our supported operating system images to your needs with [Custom Images](https://www.packet.com/developers/docs/servers/operating-systems/custom-images/).
