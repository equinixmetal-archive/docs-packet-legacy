<!-- <meta>
{
    "title":"OpenNebula miniONE",
    "description":"deploy OpenNebula single-node environments",
    "tag":["OpenNebula"],
    "seo-title": "OpenNebula miniONE - Packet Technical Guides",
    "seo-description": "deploy OpenNebula single-node environments",
    "og-title": "OpenNebula miniONE",
    "og-description":"Quickly deploy OpenNebula single-node environments"
}
</meta> -->

OpenNebula is a lightweight datacenter management solution to operate private and hybrid clouds running on the KVM, LXD, and VMware technologies. It can serve small compact clouds with just a few nodes, and scale to thousands of computing cores over multiple federated zones. It’s easy to install, maintain and upgrade, and comes with its own [Marketplace](https://marketplace.opennebula.systems/appliance), offering a selection of base appliances with popular Linux distributions with which you can quickly start. Extensive [documentation](http://docs.opennebula.org/5.10/) covers a wide range of uses, from the individual end-user to the cloud administrator preparing the deployment.

In this guide, we’ll go through a special type of deployment, the all-in-one OpenNebula environment. All the necessary services to use, manage and run the cloud will be co-located on the single dedicated bare-metal host.

While all the installation and configuration steps could be done manually by following the official documentation and would give you better insight and control over what and how it is configured, we’ll focus on the most straightforward approach leveraging the miniONE tool.

The [miniONE](https://github.com/OpenNebula/minione) tool is a simple deployment script which prepares the all-in-one OpenNebula environments. Such deployments are mainly intended for evaluation, development and testing, but can also be used as a base for larger short-lived deployments. Usually, it takes just a few minutes to get the environment ready. The tool can prepare evaluation environments for true virtual machines running on KVM hypervisors, or system containers running on LXD hypervisors.

#### Requirements
Requirements may differ for various types of evaluation enviorments which you may deploy. 

* KVM:
    * x86-64 Intel or AMD
    * 2 CPU cores
    * 4 GB memory
    * 20 GB free disk space
    * OS: Cent7, Ubuntu 16.or or 18.04
    

* LXD: 
    * x86-64 Intel or AMD
    * 2 CPU cores
    * 4 GB memory
    * 20 GB free disk space
    * OS: Ubuntu 18.04

From the available hardware types on Packet, the smallest and cheapest configuration [t1.small.x86](https://www.packet.com/cloud/servers/t1-small/) matches the base requirements for the evaluation purposes just fine. You can select a more powerful and bigger machine if you plan to run several, or resource-demanding workloads.

The deployment process with the [miniONE](https://github.com/OpenNebula/minione) tool is so quick and easy that you can switch to the new machine at any time if your existing one doesn’t fit anymore.

#### Downloads

Unless specificed, all comand below should be executed under priviledged user root. Download the latest release of the miniONE tool by running one of the following commands: 

```
# wget https://github.com/OpenNebula/minione/releases/latest/download/minione
```
```
# curl -O -L https://github.com/OpenNebula/minione/releases/latest/download/minione 
````

#### Easy Deployment 

Various command line parameters passed to miniONE can customize the deployment
process, e.g. required OpenNebula version or initial passwords. You can get a list of available switches by running:

```
# bash minione --help
```

In most cases, it’s not necessary to specify anything and simply proceed with
installation.

You have to choose between the KVM (default) or LXD evaluation environment. Run the following command under the privileged user root to get the all-in-one OpenNebula installation ready with a default KVM hypervisor:

```
# bash minione
````

Or, for LXD hypervisor: 

```
# bash minione --lxd
```

Be patient, it should take only a few minutes to get the host prepared. Main deployment
steps are logged on the terminal and at the end of a successful deployment. The miniONE tool provides a report with connection parameters and initial credentials. For example:

```
### Report
OpenNebula 5.8 was installed
Sunstone (the webui) is running on:
 http://192.0.2.1/

Use following to login:
 user: oneadmin
 password: t5mk2tvPCG
 ```

 Now, the all-in-one OpenNebula evaluation environment is ready.

 #### Validation
 Check that the base installation is working correctly by listing the hpyervisor hosts. 

 ````
 # onehost list
 ID NAME            CLUSTER TVM ALLOCATED_CPU      ALLOCATED_MEM STAT
  0 localhost       default 0  0 / 400 (0%) 0K / 7.8G (0%) on
  ````

  You should find your dedicated node configured as a hypervisor “localhost” in the “on”
state (STAT).

Or, point your browser to the Sunstone web URL provided in the deployment report
above, and login the user oneadmin with provided credentials.


![open-nebula-1](/images/open-nebula/open-neb-01.png)


#### Run Virtual Machine

To run our first virtual machine, we stick with the easy-to-use Sunstone web UI.
In the left tab, click on **Instances → VMs** to get a (currently empty) list of running
virtual machines. Click on the plus button **[+]** to start a new one.


![open-nebula-2](/images/open-nebula/open-neb-02.png)

Select the prepared template of “CentOS 7”. (Please note the initial template already has a network interface preconfigured in the “Network” section below. If you later import additional appliances from the Marketplace or your own, you will need to assign the network interface to them).

Click on the **Create** button to start the virtual machine.

![open-nebula-3](/images/open-nebula/open-neb-03.png)

When we go back to the list of virtual machines in Instances → VMs, we can see our new machine. If the virtual machine is still not in RUNNING, click the button with refresh icon to reload the data.

![open-nebula-4](/images/open-nebula/open-neb-04.png)

When the virtual machine is running, the “display” icon allows to open a graphical console. Login as user root with default password opennebula (can be changed in miniONE).

You can validate that the virtual machine can reach the public internet services. E.g.:

![open-nebula-5](/images/open-nebula/open-neb-05.png)

While being logged on your frontend under root or oneadmin user, you can login your virtual machine over SSH. The IP address of the virtual machine is visible in the virtual machines list. For example, for `172.16.100.2` try:

````
# ssh root@172.16.100.2
Warning: Permanently added &#39;172.16.100.2&#39; (ECDSA) to the list of known hosts.
Last login: Mon May 20 14:16:55 2019 from 172.16.100.1
[root@localhost ~]#
````

To terminate the virtual machine, go back to the Sunstone web UI to **Instances → VMs**. Select the particular virtual machine and click on the trash button to terminate it.

![open-nebula-6](/images/open-nebula/open-neb-06.png)

#### Conclusion

You now have the all-in-one OpenNebula environment working. If you are new to the OpenNebula, you can continue with reading the simple tutorial provided on the homepage of [miniONE](https://github.com/OpenNebula/minione), or a deep dive into the extensive [documentation](http://docs.opennebula.org/5.10/) for OpenNebula. [The Community forum](https://forum.opennebula.org/) can also be used to ask questions or get help with any problems.