<!-- <meta>
{
    "title": "Ditch Cobbler for RackN",
    "description": "Ditch Cobbler for RackN on Packet",
     "tag": ["Ditch Cobbler", "RackN"],
    "seo-title": "Ditch Cobbler for RackN - Packet Technical Guides",
    "seo-description": "Ditch Cobbler for RackN on Packet",
    "og-title": "Ditch Cobbler for RackN",
    "og-description": "Ditch Cobbler for RackN on Packet"
}
</meta> -->

Ditch Cobbler for RackN

Booting bare metal servers used to be hard and finicky, with a limited set of tools- often antiquated. Take our dear old friend Cobbler! Tried and true but outdated, and thus difficult to rely upon for modern, scalable infrastructure. In this guide, we'll show you how to use the [RackN Digital Rebar](https://rackn.com/) framework to orchestrate bare metal in any environment, using Packet's bare metal cloud as a natural extension of on-premise infrastructure so you can make your automation portable right down to the bootstrapping process.

TL;DR? In under 30 seconds with your Packet account, you can test the custom IPXE boot using the [http://packet.rebar.digital/default.ipxe](http://packet.rebar.digital/default.ipxe) endpoint that RackN has enabled for quick starts. See the video here:

_Skip ahead to the deploying section if you want to jump right into the action!_

## A History Lesson Through our Dusty Toolshed

Simply put: bootstrapping is hard. It relies on working with systems before they have any real operating environment or network connectivity with opaque tools like TFTP, PXE and Grub; consequently, most teams have been content to do this one time and try to pretend that they are done.

In the cloud age of "cattle" instead of "pet" we don't have the luxury of special snowflake manual processes. We need to be able to repeat and automate even the thorniest aspects of the infrastructure lifecycle.

So what do you use to be able to reprovision on-premises hardware quickly with reusable libraries that integrate into automated systems? Legacy provisioning tools like [Cobbler](http://cobbler.github.io/) - which is one of the best and most proven out there- were simply not designed to handle this. They were more of the "once-or-twice-and-done" model.

That's why most users who need to automate metal still end up writing custom scripts with lots of chewing gum and creative hacking.

## Moving to a Modern Framework- Why?

Since we live in an API driven world where we expect infrastructure to be drivable by REST API's, it's time to get real about dealing with physical hardware and all of its associated variables and inconsistencies.

Instead of a dusty toolshed that includes our old friend Cobbler, let's move into a modern lab environment to learn and then stress test with purpose-built tools like open [Digital Rebar Provision](https://github.com/digitalrebar/provision).

Why Digital Rebar? Well, it is built using [cloud native](https://robhirschfeld.com/2017/05/04/cloud-native-physical-provisioning/) principles like well-defined REST APIs, remote configuration via CLI, 12-factor design, and default security. In fact, RackN uses Packet to CI/CD the Digital Rebar base deployment templates on every commit!

<q> _Digital Rebar Provision is designed to enable completely API-driven hardware automation and yet be simple to start and use without learning complex protocols._</q>

Most critical for Packet users, the Digital Rebar design allows you to pick and choose which parts of the provisioning services (DHCP, TFTP, HTTP) you want to use in each environment. At Packet, it's just HTTP for IPXE but the same script will work in a data center with a full DHCP, TFTP, HTTP stack.

## Core Concepts and Discovery Boots

Network provisioning a server relies on a series of boot strapping environments to get fully on the network. Packet takes care of the first stage, PXE, and lets you chain in your own second stage, IPXE.

That second stage has enough smarts to install a minimal operating system and then run "real" configuration tools like kickstart, preseed or cloud-init. On premises, this type of loading is pretty common; however, it's unique in a laaS environment.

To take advantage of this custom IPXE alternative, you must provide a web server with the correct templates. This can be challenging (in all environments) because the templates must be tuned to each machine.

Digital Rebar provision handles this with global, profile and machine level parameters. Instead requiring upfront configuration, a machine registers the first time it boots through a discovery process ([workflow documentation](http://provision.readthedocs.io/en/stable/doc/workflows.html)).

## Deploying at Packet

There are two parts to getting this working: 1) creating servers with a Custom IPXE boot and 2) installing Digital Rebar Provision on a Packet server.

The whole process, including reading the instructions should take under 20 minutes!

### Step 1: Using Packet's Custom IPXE

Custom IPXE is an OS option when you create a Packet server. Simply choose "Custom IPXE" as your operating system type and provide the URL pointing to your Digital Rebar Provision service. You cannot change this value after the server is deployed, so you may need to create multiple servers to get this right.'

RackN has provided [http://packet.rebar.digital/default.ipxe](http://packet.rebar.digital/default.ipxe) as an IPXE endpoint that only installs the Digital Rebar Sledgehammer version of Centos (user root, password rebar1).  You can use that URL to validate the Custom IPXE setting in Packet without first taking the time to install Digital Rebar Provision (see [video of process](https://www.youtube.com/watch?v=KkUUnUJ1NvE&feature=youtu.be)).

Remember to check "manage" and "Persist PXE" so you can keep using the IPXE server after the first boot!

### Step 2: Installing Digital Rebar Provision

Digital Rebar Provision is a simple Golang service with a multi-platform CLI. You can install it using the [quick start guide](http://provision.readthedocs.io/en/stable/doc/quickstart.html) in a few minutes on a Type 0 server. Once you have the service installed, RackN provides a [web interface](https://rackn.github.io/provision-ux/#/) for Digital Rebar Provision that makes it easy to visually manage the machines and boot environments.

As you create Packet servers pointing to your endpoint, you'll be able to use the web interface to see them get discovered and then set their boot environment.

More detailed installation is available to install as a system daemon.  Once installed, you can run the API or CLI from remote to provide full control of your Packet boot environment.

* Install Digital Rebar Provision-[https://youtu.be/xTrBcQiW_eI](https://youtu.be/xTrBcQiW_eI)
* Add your SSH Keys-[https://youtu.be/K_DHSB-JQyQ](https://youtu.be/K_DHSB-JQyQ)
* Install Ubuntu-[https://youtu.be/K_DHSB-JQyQ](https://youtu.be/K_DHSB-JQyQ)

Remember that your own Digital Rebar Provision server will use 8091 as the IPXE port by default so your Custom IPXE URL will be http://[ipaddress]:8091/default.ipxe. The API default endpoint is 8092 with user rocketskates & password r0cketsk8ts.

## Extend this to Your Own Environment

Of course, you can do this on your own laptop or data center too.

The purpose of Digital Rebar is to make automation easy and portable. You can use the API to export and import templates between different endpoints. RackN provides additional tooling and scripts to greatly enhance your to Digital Rebar Provision experience including CI/CD pipelines, advanced workflows, BIOS configuration, event notifications and even Slack integrations.
