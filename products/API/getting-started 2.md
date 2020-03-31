<!-- <meta>
{
    "title":"Overview",
    "description":"An introduction to the Packet API.",
    "tag":["API", "Integrations", "Libraries"],
    "seo-title": "Packet Bare Metal API Documents",
    "seo-description": "An introduction to the Packet API.",
    "og-title": "Overview",
    "og-description": "An introduction to the Packet API."
}
</meta> -->

Packet was built for a developer-centric world, which means that our API is the heart and soul of the platform. In fact, the Packet portal is just a consumer of our API - so anything you can do in the portal you can also do via the API! (protip: “undocumented” api calls can be found and used by using your browser’s inspection console)

Users can also leverage a wide range of integrations and tooling - some that we’ve produced (like our Docker Machine driver and various API libraries) and others that are supported by their respective communities (like Docker Cloud, Terraform, or Ansible).

Interacting with Packet bare metal is a lot like dealing with VM’s at a public cloud.  So if you are comfortable with AWS or Digital Ocean then working with Packet should feel familiar.

### Prerequisites

The first thing you’ll want to do once you’ve signed up and added your SSH key, is to grab an API key. Your API keys operate with all the permissions your user account in the portal does, so be sure to keep them safe. Name your keys something that will remind you where you are using them, e.g. the name of a workstation or application.

### Project Level API Key

Limit API access  to a particular project. To create one, go to your specific project, and then project settings as shown below.

![project settings](/images/api-integrations/Project-API-Key.png)

### User Level API Key

User level API permits complete access to all projects/ORGs assigned to the particular user. To create one, click user icon top right then click API Keys.

![user API key](/images/api-integrations/User-API-key.png)

### Obtain project ID

The next thing that you need to know is that most integrations require a project ID, so once you’ve created your first project, navigate to the settings area for that project to find the project ID.

![project ID](/images/api-integrations/Project-ID.png)

### Consuming the API

Everything that you with Packet, you can do via our API, which is modern, RESTful and easy to use!

* __API Docs:__ check out our API [documentation](https://www.packet.com/developers/api/).
* __API Libraries:__ browse our full list of [official API libraries](https://www.packet.com/developers/libraries/).
* __DevOps Tools:__ we integrate with a broad array of [popular tools](https://www.packet.com/developers/integrations/).
* __CLI:__ interact with our API through our [official command line interface](https://github.com/packethost/packet-cli).


No matter how you're interacting with our API, there are a few things to point out that will help you get started on the right foot:

* Servers are called "Plans" in the API, and are specified with slugs that start with “baremetal”, e.g. “c1.small.x86” represents our c1.small server. You can get the full list of available plans by calling the [/plans endpoint](https://www.packet.com/developers/api/plans).  
* Our [block storage instances](https://www.packet.com/developers/api/volumes) are referred to as "volumes" in the API.  
* [IP's](https://www.packet.com/developers/api/ipaddresses) are managed in a few places in the API. You can view the list of them in the projects namespace and you can assign/unassigned them to devices in the devices namespace.
* You can also query the [capacity endpoint](https://www.packet.com/developers/api/capacity) to get a status on the availability of server types in various facilities.
