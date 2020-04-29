<!-- <meta>
{
    "title":"miniONE Edge Cloud install with Packet",
    "description":"miniONE is a tool to really help get users “up and running” with an OpenNebula environment",
    "tag":["virtual machines", "open nebula", "miniONE"],
    "seo-title": "miniONE Edge Cloud install with Packet - Packet Technical Guides",
    "seo-description": "miniONE is a simple evaluation tool that allows you to deploy all-in-one installation for KVM or LXD deployments in a few simple steps.",
    "og-title": "miniONE Edge Cloud install with Packet",
    "og-description": "miniONE is a tool to really help get users “up and running” with an OpenNebula environment. We hope you see how easy it is to start your own edge deployment or eventually extend your current setup to the edge"
}
</meta> -->

OpenNebula miniONE as a simple evaluation tool that allows you to deploy all-in-one installation for KVM or LXD deployments in a few simple steps. One of the various options enables you to build an OpenNebula edge cloud using bare-metal cloud resources from Packet. With this architecture, you will be able to see just how simple it is to build your private cloud and to deploy and configure Packet resources on-demand.

#### Frontend

You will need one host for the OpenNebula frontend. It could be a physical host in your rack, your own VM or even a host running in the public cloud. Choose either the Centos/Redhat or Ubuntu/Debian family, just ensure it is a relatively fresh and updated system.


For this demo, we decided to also run the frontend on the small Packet host, so let’s start at Packet. For the operating system it could be Ubuntu 19.04. You can even choose fairly priced t1.small server, OpenNebula is not greedy.

As soon as your server is ready, connect to it and download the tool

```
# wget 'https://github.com/OpenNebula/minione/releases/latest/download/minione'
```

To start the edge deployment you will need to both the project ID and API Token.

Choose the location for your Edge deployment. For this example, we are using Sunnyvale, CA for which the code name is `sjc1`.


Finally choose the device type. Suggestion is to keep using the `t1.small` as the default. To opt for an alternate type, provide it using the `--edge-packet-plan` parameter.

#### Time for deployment

```
# bash minione --edge packet --edge-packet-facility sjc1 --edge-packet-token [API_TOKEN] --edge-packet-project [project UUID]
````

> **_NOTE:_** You may see error: "Check jq installed FAILED. Install jq package first

miniONE would like to validate all the Packet parameters and to parse the json output `jq` command is needed. In our case we will install it using:

````
apt update && apt install jq
````

Re-run the deployment. While miniONE is running, you should receive a siilar output

```
### Checks & detection
Checking AppArmor  SKIP will try to modify

### Main deployment steps:
Install OpenNebula frontend version 5.8
Install ONEProvision
Configure IPAM Packet, alias IP mapping driver, VM hooks
Trigger oneprovision
Export appliance and update VM template

Do you agree? [yes/no]:
yes

### Installation
Updating APT cache  OK
Configuring repositories  OK
Updating APT cache  OK
Installing OpenNebula packages  OK
Installing Ruby gems  OK
Installing opennebula-provision package   OK

### Configuration
Applying packet changes to oned.conf  OK
Configuring packet hooks in oned.conf  OK
Update ssh configs to accessing Packet hosts  OK
Switching OneGate endpoint in oned.conf  OK
Switching scheduler interval in oned.conf  OK
Setting initial password for current user and oneadmin  OK
Changing WebUI to listen on port 80  OK
Starting OpenNebula services  OK
Enabling OpenNebula services  OK
Add ssh key to oneadmin user  OK
Update ssh configs to allow VM addresses reusig  OK
Ensure own hostname is resolvable  OK
Checking OpenNebula is working  OK
Prepare packet template  OK
Checking packet template [/tmp/tmp.ukRnn6J8BE]  OK
Running oneprovision
2019-10-24 12:07:01 INFO  : Creating provision objects
WARNING: This operation can take tens of minutes. Please be patient.
2019-10-24 12:07:04 INFO  : Deploying
2019-10-24 12:10:40 INFO  : Monitoring hosts
2019-10-24 12:10:42 INFO  : Checking working SSH connection
2019-10-24 12:10:44 INFO  : Configuring hosts
ID: 794e1810-a9f4-4047-8601-b4aad4a7d086
OK
Exporting [Service WordPress - KVM] from Marketplace to local datastore  OK
Updating VM template  OK
````

Finally, post deployment, a successful report

````
### Report
OpenNebula 5.8 was installed
Sunstone [the webui] is running on:
  http://147.75.84.191/
Use following to login:
  user: oneadmin
  password: xDV36pWwGe

### Packet provisioned
  ID NAME            CLUSTER   TVM      ALLOCATED_CPU      ALLOCATED_MEM STAT
   0 147.75.82.249   PacketClu   0                  -                  - init
````
After a few moments, penNebula monitors the Packet host and you can see it on. Check using `onehost list` you will see a similar output:

````
# onehost list
  ID NAME            CLUSTER   TVM      ALLOCATED_CPU      ALLOCATED_MEM STAT
   0 147.75.82.249   PacketClu   0       0 / 400 (0%)     0K / 7.8G (0%) on
````


#### Run the VM

At this point, you have a ready-to-use OpenNebula frontend connected with the KVM hypervisor on the Packet and you are ready to deploy your VMs. You can do it using the Sunstone frontend or just by typing

````
# onetemplate instantiate 0
````
For demo purposes, the default appliance is the WordPress service app. When the first VM is running, browse to the public IP of the VM and you will see the a bootstrapped Wordpress page. of the VM and you should get a bootstrapped WordPress page.

![miniONE](/images/minione/wordpress.png)

To obtain the VM public IP you would run:

````
onevm show 0 | grep ETH0_ALIAS0_IP
````
and see the following output:
````
ETH0_ALIAS0_IP="147.75.82.242",
````

miniONE gives you an option to extend the deployment by adding additional hypervisor nodes at the edge. To do so simply add an option `--node` to the deployment command and run it again. For this demo we opted for `ams1` facility-code.

You may choose a different appliance for your particular use case. Go to the [Open Nebula marketplace](https://marketplace.opennebula.systems/appliance) and pick one of the systems.

> **_NOTE:_**  Exact name is a requirement to the parameter `--edge-marketapp-name`. For instance `CentOS 7 - KVM` is a valid option.

````
# ./minione --edge packet --node --edge-packet-token [token] --edge-packet-project [project] --edge-packet-facility ams1
````

When the deployment completes, you should then see two hosts.

````
# onehost list
  ID NAME            CLUSTER   TVM      ALLOCATED_CPU      ALLOCATED_MEM STAT
   1 147.75.82.195   PacketClu   0       0 / 400 (0%)     0K / 7.8G (0%) on
   0 147.75.82.249   PacketClu   1    100 / 800 (12%)   768M / 7.8G (9%) on
````

Under the hood, miniONE uses the [DDC](http://docs.opennebula.org/5.8/advanced_components/ddc/) tool called [oneprovision[(http://docs.opennebula.org/5.8/advanced_components/ddc/usage.html)], which also offers a command-line interface. To list the Packet resources, type:

````
# oneprovision list
                                  ID NAME                      CLUSTERS HOSTS VNETS DATASTORES STAT
642e1b04-d266-4ed6-abf4-906ca4a08898 PacketProvision-101              1     1     2          2 configured
794e1810-a9f4-4047-8601-b4aad4a7d086 PacketProvision-100              1     1     2          2 configured
````
To view the specifics type:

````
# oneprovision show 642e1b04-d266-4ed6-abf4-906ca4a08898

PROVISION 642e1b04-d266-4ed6-abf4-906ca4a08898 INFORMATION
ID      : 642e1b04-d266-4ed6-abf4-906ca4a08898
NAME    : PacketProvision-101
STATUS  : configured

CLUSTERS
101

HOSTS
1

VNETS
3
2

DATASTORES
103
102
````

#### Pricing and cleanup

Before you finish the evaluation, don’t forget to cleanup. To delete the Packet nodes you can use again the oneprovision command. Then also delete the frontend from the Packet.

If you choose the t1.small server for the frontend and nodes as we did, the final price could hardly exceed $1 as the hourly price for the server is $0.07.

````
# oneprovision delete [id] --cleanup
````
