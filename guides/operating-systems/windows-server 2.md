<!-- <meta>
{
    "title":"Windows Server",
    "description":"Accessing RDP and other Tips & Tricks while using Windows Server on Packet",
    "tag":["Operating Systems", "Windows"],
    "seo-title": "Windows Server - Packet Developer Docs",
    "seo-description": "Learn more about utilizing Windows Server at Packet",
    "og-title": "Windows Server",
    "og-description": "Learn more about utilizing Windows Server at Packet"
}
</meta> -->

Packet currently offers Windows Server 2012 R2 and Windows Server 2016. A comparison grid of our supported Operating Systems, including licensed OS's, can be found [here](https://www.packet.com/developers/os-compatibility/).

#### Windows License Pricing
Packet charges a flat $0.01 / hr per core for both the 2012 R2 and 2016 Standard versions of Windows Server.  Fees will be added to your invoice on the 1st of each month.  Since various server configurations have a different number of cores based upon their processor(s) - as such the additional licensing costs will vary. 

#### Accessing RDP (Remote Desktop Protocol)
Once the server you deployed is Active, you can RDP in as Admin and using the password you will find on the server's details page. Our Windows image utilizes the default RDP port 3389. To create an RDP session, dependent upon your local OS here are a few options: 

**Windows Machine:** 

Windows → All Programs →  Remote Desktop Connection
    
**MacOS/OSX:** 

There are many applications for RDP sessions for simplicity sake we suggest Microsoft Remote Desktop client. You can find this through the App Store, or by clicking [here](https://itunes.apple.com/us/app/microsoft-remote-desktop/id715768417?mt=12). 

**Linux/Other OS's:** 

[Remmina](https://www.remmina.org/wp/). You can learn more about it via their [FAQ](http://www.remmina.org/wp/faq/) & see screenshots of it in action [here](http://www.remmina.org/wp/screenshots/). 

**Using User Data with Windows**  

PowerShell is a supported executable target for [cloud-init](https://cloudbase-init.readthedocs.io/en/latest/userdata.html#powershell), allowing you to configure a host at provisioning time. More about [User Data on Packet can be found here](https://www.packet.com/developers/docs/servers/key-features/user-data/).

**Elastic Block Storage Support**

Our Elastic Block Storage is [supported on Windows instances](https://www.packet.com/resources/guides/elastic-block-storage-windows-server/). 
