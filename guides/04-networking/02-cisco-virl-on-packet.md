<!-- <meta>
{
    "title":"Cisco VIRL on Packet",
    "description":"Cisco VIRL – or Virtual Internet Routing Labs – is a network simulation framework that enables the rapid design, configuration, and testing of comprehensive network and service-delivery solutions.",
    "tag":["Cisco", "VIRL"],
    "seo-title": "Cisco VIRL on Bare Metal - Packet Technical Guides",
    "seo-description": "Using Cisco VIRL on Packet",
    "og-title": "BGP Global Communities",
    "og-description": "Using Cisco VIRL on Packet"    
}
</meta> -->


Cisco VIRL – or Virtual Internet Routing Labs – is a network simulation framework that enables the rapid design, configuration, and testing of comprehensive network and service-delivery solutions.

VIRL has many applications and uses and can provide significant value to everyone from students, educators, network engineers, to the largest corporate network operations teams. Some typical use-cases include:

* Learning basic network technologies
* Delivering network, protocol, or solution training
* Testing new features
* Developing and testing new configurations in advance of live rollouts
* Troubleshooting issues observed in live networks
* Validating changes as part of a DevOps / NetOps tool-chain
* Delivering demonstrations of features and applications
* Providing a network target for SDN applications development.

The list could go on. Anyone who needs access to a test or development environment that is flexible, powerful, inexpensive, and best of all – virtual – can use VIRL. For students, it may be very difficult to find real equipment to practice on for labs and certifications. For professionals, it's often time-consuming and error-prone to rack, wire, upgrade, and configure equipment to develop a configuration, evaluate a feature, or test an application. – assuming the the equipment is even available.

This is where VIRL can deliver significant value. It provides the ability to graphically design a network that includes virtualized instances of all Cisco Network Operating Systems – IOS, IOS XR, CSR1000, NX-OS, ASA, and other 3rd-party servers, network devices, and virtualized network functions like packet and route generators.

Once designed, VIRL provides the ability to automatically configure IP addressing and routing protocols so you can get up and running fast. Or not. Maybe you want to do it all by hand.

When you are ready, you can launch a simulation of your network and access the devices in-band or out-of-band right from your laptop. You can even extend VIRL to integrate with real live networks using data-plane connections built over physical or virtual (OVPN) connections.

## Just so you know

One important thing to know about VIRL is perhaps what it does not do. The virtualized operating systems provided by VIRL include the real control- and management-plane code found in the real shipping equipment, but there is no attempt made to represent actual hardware. There are not fan-trays, or blades, or route-processors in VIRL images, and if a feature requires an ASIC for implementation – like traffic-shaping or policing – you can configure it, but the results you see will not match what you'll see on actual hardware.

## Getting and Using VIRL

VIRL is a licensed product currently available with a 20-node cap. That cap applies to Cisco network operating systems, but not other 3rd-party devices if any are included in a simulation. You can learn more about VIRL and purchase a license at Cisco's [VIRL](http://virl.cisco.com/) marketplace.

VIRL is delivered as an OVA that can be deployed to Servers or PCs using VMware hypervisors, and as an ISO / UEFI image that can be deployed to bare-metal. Installing VIRL locally is straightforward but it does takes some time to download – and you have to pay attention to things like the creation of networks (physical or virtual), time-synchronization, and licensing.

Or – you could just deploy on Packet! On Packet you get VIRL on a high-performance bare-metal platform of your choice, we do the installation for you, and it's fast – as fast as 8-10 minutes in many cases. Plus – on Packet your VIRL license is doubled to 40 nodes!

Once you've gotten a VIRL license come back here and keep reading. Everything you need to know to get up and running is provided below.

## About VIRL on Packet

Packet offers a wide variety of bare-metal server types but only some of them are suitable for use with VIRL. First, VIRL requires an AMD64 architecture. Second, some Packet servers provide hardware that is just not applicable or used by VIRL, so there's no need to pay for it. We recommend  [t1.small.x86](https://www.packet.com/cloud/servers/t1-small/) (formerly "Type 0"), [c1.small.x86](https://www.packet.com/cloud/servers/c1-small/) (formerly "Type 1"), and [m1.xlarge.x86](https://www.packet.com/cloud/servers/m1-xlarge/) (formerly "Type 2") servers:

Cisco provides a [resource calculator](http://virl.cisco.com/) that you can use to size a system based on your needs, but in general customers use:

* t1.small for simulations of up to 12 nodes of IOSv. (Education)
* c1.small for larger simulations of 10 to 30 nodes including a mix of IOSv, servers, and a few of the the 'heavier' operating systems like IOS XRv, CSR1000v, an NX-OSv. (Small-scale professional use).
* m1.xlarge for up to 40 nodes including a mix that is skewed towards the heavier operating systems. (Large-scale professional use).

## Deploying VIRL on Packet

Deploying VIRL on Packet is easy using Packet's IPXE / custom-image service.  You can be up and running in minutes with a licensed, customized VIRL server using the following steps:

1. Sign Up / Login to Packet.

2. If you are a first time user, an Organization will be automatically created. You must [add a Public SSH Key](https://support.packet.com/kb/articles/ssh-access) which is needed in order to deploy and access the servers

3. Create a new Project where you will then deploy the server/s.

4. Select ' **Deploy Server**' from the portal menu.

![deploy-server](/images/cisco-virl-on-packet/deploy-server-new.png)

5. a) Enter your **hostname**.

    b) Select one of our 4 [Core Locations](https://www.packet.net/locations/): **Sunnyvale**, **Amsterdam**, **Tokyo** or **Parsippany.**

    c) Select your host type.  **Only t1.small, c1.small and m1.xlarge** are supported.

    d) Select ' **Custom iPXE**' for the Operating System.

   e) Enter ' **http://packet.virl.info**' into the iPXE URL box.

![ipxe-url](/images/cisco-virl-on-packet/custom-ipxe-url.png)

6. Scroll down to ' **Optional Settings**' and tick ' **Add User Data**' switch to input your 'cloud-config' YAML script.

![optional-user-data](/images/cisco-virl-on-packet/optional-user-data-new.png)

7. Define your license and password settings by entering (or pasting) your 'cloud-init' YAML into the ' **Add optional user data**' box.

**NOTE:** The use of user data is completely optional.  If it is omitted your VIRL server will still deploy with default passwords and without a license.

The data used to define your passwords and license information if must be formatted as YAML and structure as follows:

* The first line must be ' **#cloud-config**'
* The following keys are valid:
  - **license_file**: the full name of your VIRL license file.
  - **license_pem**: the complete PEM-key contents of your license file.
  - **uwm_password**: the password assigned to the 'uwmadmin' user.
  - **guest_password**: the password assigned to the 'guest' user.
  - **virl_password**: the password assigned to the 'virl' host user.
* **Multi-line values must be identified using a pipe ('|') on the key-line with the indented contents on subsequent lines.**
* Any invalid keys or data will simply be ignored and defaults used instead during deployment.

The following is an example of properly-formatted user data:

```bash
#cloud-config

license_file: your-id.virl.info.pem

license_pem: |
   -----BEGIN RSA PRIVATE KEY-----
   xxxxxxxxx
   xxxxxxxxx
   -----END RSA PRIVATE KEY-----

uwm_password: password

guest_password: guest

virl_password: VIRL

```

**NOTE**: Please ensure you are indenting the key from start to finish.Also, your user-data is not visible to anyone other than you or authorized project collaborators and is encrypted when sent to Packet.  If you're concerned about providing confidential information in this manner you can skip entering user-data and customize VIRL from the UWM once deployed.

Ensuring that the format carries over when pasted into a text editor it is suggested for Windows users to make use of [NotePad++](https://notepad-plus-plus.org/) &  MacOS users to use [Visual Code](https://code.visualstudio.com/), [Sublime Text](https://www.sublimetext.com/), or the like. 

When you've entered your user-data it should appear like the following, except with your confidential passwords and license information:

![confirmation](/images/cisco-virl-on-packet/confirmation-new.png)

8. Select ' **Deploy Now**' to begin the deployment process.

![deploy-now](/images/cisco-virl-on-packet/deploy-now.png)

9. Wait for your the server to be completely deployed, then select the host name to get into server's details page.

![server-wait](/images/cisco-virl-on-packet/server-wait.png)
![server-complete](/images/cisco-virl-on-packet/server-complete-new.png)

10. After the server is deployed, VIRL will go through the configuration process wich should take another 5-7 minute.

If you switch to the 'Timeline' tab you can observe all of the User Events that are posted during the VIRL deployment, including information about application of your passwords and license.

Once VIRL is completely configured and ready for use you will see a message indicating successful provision and you can reach the VIRL UWM interface for management through its IP address (http://<your.virl.server.ip>).

![timeline](/images/cisco-virl-on-packet/timeline.png)

11. Navigate to the UWM address and login as either 'guest' or 'uwmadmin'. If you set custom passwords use these. If not, the defaults are 'guest', and 'password', respectively.

12. If you do not already have the VM Maestro client use the menu on the left to navigate to ' **VIRL Server**' and ' **Downloads**', download the appropriate version, and install it locally:

![downloads](/images/cisco-virl-on-packet/downloads.png)

13. Open VM Maestro and connect to your Packet VIRL deployment. If you're starting VM Maestro for the first time: 

* Read and acknowledge the License Agreement.
* When prompted, enter the IP address of your Packet VIRL deployment and your 'guest' user credentials. Once you've done that you should see 'All web services are verified':

![verified](/images/cisco-virl-on-packet/verified.png)

If you already have VM Maestro installed you can create another profile to connect to your Packet VIRL deployment:

* After VM Maestro opens select the 'Active Profile' button on the status bar:

![active-profile](/images/cisco-virl-on-packet/active-profile.png)

* Select the 'Add' button in the Web Services dialog box:

![add-web-services](/images/cisco-virl-on-packet/add-web-services.png)

* Enter a name for the connection profile and replace 'localhost' with the address of your Packet VIRL deployment, then select 'OK':

![localhost](/images/cisco-virl-on-packet/localhost.png)

* Select the 'Credentials' button:

![credentials](/images/cisco-virl-on-packet/credentials.png)

* Enter the 'guest' username and password and select 'OK':

![guest-username](/images/cisco-virl-on-packet/guest-username.png)

* Verify that all of the web services show as 'Compatible':

![verify-compatibility](/images/cisco-virl-on-packet/verify-compatibility.png)

That's it – you're now ready to use VIRL!

## **Using VIRL on Packet**

There are a few more things you need to know once you're up and running on Packet.

**At Packet you are getting your own dedicated bare-metal machine that is yours alone from the time you provision your server until you actually delete the device from your account.  So even if you were to power it down, it would still accrue usage until you actually delete it from your account.**

**You are responsible for ensuring that you terminate the VIRL server instance in order to avoid unexpected charges.**

**Issues relating to the operation of VIRL on the server should be directed to VIRL's [community forum](https://learningnetwork.cisco.com/groups/virl). There is no special support offering in respect to using VIRL on Packet's bare metal platform.**

When using VM Maestro all of your topologies are saved locally. Nothing is kept on your VIRL server on Packet. If you tear-down your Packet server your topologies won't be lost and you can launch the again the next time you deploy and connect to a VIRL server on Packet.

However – if you happen to customize VIRL by adding custom images these will be lost once you destroy your server on Packet. We are looking at a way to enable persistence but that is not yet available.

Finally – if you need help getting started with VIRL there are good tutorials available at the VIRL [documentation site](http://get.virl.info/).

**For more information about using VIRL on Packet you can contact Brian at [bdaugher@cisco.com](mailto:bdaugher@cisco.com) or visit the [Cisco VIRL community](https://learningnetwork.cisco.com/groups/virl).**

## Summary

Deploying VIRL to Packet is easier than ever!  Once your deployment shows as ready you can use it just like you would a local VIRL server, including the use of Open VPN connectivity to access devices in your simulations directly.
