<!--
<meta>
{
    "title":"Deploy DC/OS with Terraform",
    "description":"Deploy DC/OS with Terraform",
    "author":"Zak",
    "github":"zalkar-z",
    "date": "2019/09/05",
    "email":"zak@packet.com",
    "tag":["DC/OS", "Terraform", "Datacenter Operating System"]
}
</meta>
-->

Deploy DC/OS with Terraform

# Introduction

Unless you've been living under a rock for a year or two! It's hard to miss Mesosphere. The company was founded in 2013 and is already working under the hood at companies like Twitter and Apple. Mesosphere is dedicated to commercializing UC Berkeley's [AMPLab](https://amplab.cs.berkeley.edu/) born [Apache Mesos](http://mesos.apache.org/) technology.

Mesosphere's flagship product [DC/OS](https://mesosphere.com/product/), which stands for Datacenter Operating System, aims to simplify the complex job of managing operations inside a production data center while achieving a high level of resource utilization. Basically, it helps you run all those complicated, pesky applications and workloads efficiently and confidently.

In this guide we'll be using DC/OS to manage resources inside of Packet's [EWR1](https://www.packet.net/locations/new-york-metro/) datacenter. To deploy our resources and the DC/OS web installer we'll be using [Terraform](https://www.terraform.io/). Terraform lets you easily deploy and manage infrastructure for a single application or your entire data center via configuration files!

We're assuming you already have a Packet account and a project created! Also, you'll need to have an API key ready to go.  Need help? Check out the [Quick Start articles](https://support.packet.com/kb/quick-start) in our help section.

# Step 1: Download Terraform

[Download the proper package](https://www.terraform.io/downloads.html) for your operating system and unzip it inside a directory where you want it to be installed, preferably one where your local environment is looking for executables - i.e. for Mac's, generally, that would be _/usr/local/bin_. In this guide we're working with terminal and macOS Sierra.

```bash

  cd /usr/local/bin/
  curl -O https://releases.hashicorp.com/terraform/0.8.5/terraform_0.8.5_darwin_amd64.zip &&
  unzip terraform_0.8.5_darwin_amd64.zip
```

To verify the installation you can run the `terraform` command. The ouput should look like so...

```default

  Usage: terraform [--version] [--help] <command> [args]

  The available commands for execution are listed below.
  The most common, useful commands are shown first, followed by
  less common or more advanced commands. If you're just getting
  started with Terraform, stick with the common commands. For the
  other commands, please read the help and docs before usage.

  Common commands:
      apply              Builds or changes infrastructure
      console            Interactive console for Terraform interpolations
      destroy            Destroy Terraform-managed infrastructure
      fmt                Rewrites config files to canonical format
      get                Download and install modules for the configuration
      graph              Create a visual graph of Terraform resources
      import             Import existing infrastructure into Terraform
      init               Initializes Terraform configuration from a module
      output             Read an output from a state file
      plan               Generate and show an execution plan
      push               Upload this Terraform module to Atlas to run
      refresh            Update local state file against real resources
      remote             Configure remote state storage
      show               Inspect Terraform state or plan
      taint              Manually mark a resource for recreation
      untaint            Manually unmark a resource as tainted
      validate           Validates the Terraform files
      version            Prints the Terraform version

  All other commands:
      debug              Debug output management (experimental)
      state              Advanced state management
```

# Step 2: Create a Terraform Project Directory

Create a directory to house all of our configuration files. For this guide we'll be creating a directory called _packet-terraform_ in our home directory. In it we'll create configuration files for Terraform (_.tf_ files) along with some shell scripts for getting DC/OS up and running.

```bash

  mkdir ~/packet-terraform
```

The `terraform` command by default looks for _.tf_ files inside the directory it is called in so navigate to the newly created directory.

```bash

  cd ~/packet-terraform
```

**_Note, everything from this point on should be done from the 'packet-terraform' directory we created._**

# Step 3: Generate an SSH Key Pair

The key will allow your [DC/OS Nodes](https://docs.mesosphere.com/1.8/overview/concepts/) to talk to each other via SSH. The DC/OS Bootstrap Node will ask for your private key towards the end of this guide and your public key will be added to every other server we deploy via [user data](https://support.packet.com/kb/articles/user-data) supplied in our Terraform file.

Create a key named _dcos-key_.

```bash

  ssh-keygen -t rsa -f ~/packet-terraform/dcos-key
```

# Step 4: Create Shell Scripts

We'll need 2 shell script files to do this properly. First up! User data we'll pass to the Bootstrap node. This will download the DCOS installer, start the installer in web mode, and start a docker container that will run [Apache Zookeeper](https://dcos.io/blog/2016/introduction-to-zookeeper/index.html).

```bash

  echo '#!/bin/bash
  wget -P /tmp http://downloads.mesosphere.com/dcos/stable/dcos_generate_config.sh &&
  docker run -d -p 2181:2181 -p 2888:2888 -p 3888:3888 --name=dcos_int_zk jplock/zookeeper &&
  sudo bash /tmp/dcos_generate_config.sh --web' >> ~/packet-terraform/user-data.sh
```

Next up! The [ip-detection](https://dcos.io/docs/1.7/administration/installing/custom/advanced/) script necessary for DC/OS nodes to broadcast their IP.

```bash

  echo '#!/bin/bash
  # Example ip-detect script using an external authority
  # Uses the AWS compatible Packet Metadata Service to get the nodes internal
  # ipv4 address
  echo $(curl -fsSL https://metadata.packet.net/2009-04-04/meta-data/local-ipv4)' >> ~/packet-terraform/ip-detection.sh
```

# Step 5: Create Your Terraform Variables

[Terraform configuration files](https://www.terraform.io/docs/configuration/) are combined when you run `terraform` so you can organize your [Terraform variables](https://www.terraform.io/intro/getting-started/variables.html) in a separate file. In this guide we'll call that file _vars.tf_.

Create the file...

```basg

  touch ~/packet-terraform/vars.tf
```

You can use whatever text editor you're comfortable with but to speed this process along, here is a sample configuration file you can use!

```js

  // PACKET CREDENTIALS
  // Your Packet API Key, grab one from the portal at https://app.packet.net/portal#/api-keys
  variable "packet_api_key" {
    default = "YOUR-API-KEY"
  }

  // Your Project ID, you can see it here https://app.packet.net/portal#/projects/list/table
  variable "packet_project_id" {
    default = "YOUR-PACKET-PROJECT-ID"
  }

  // INFRASTRUCTURE
  // The values for these variables can be found using the Packet API, more here https://www.packet.net/developers/api/. You can also learn more about DC/OS server types here https://docs.mesosphere.com/1.8/overview/concepts/

  // The Packet data center you would like to deploy into, the up-to-date list is available via the API endpoint /facilities
  variable "packet_facility" {
    default = "ewr1"
  }

  // All server type slugs are available via the API endpoint /plans

  // The Packet server to use as your DC/OS agents
  variable "packet_agent_type" {
    default = "baremetal_0"
  }

  // The Packet server to use as your DC/OS master server
  variable "packet_master_type"  {
    default = "baremetal_0"
  }

  // The Packet server to use as your DC/OS boot server
  variable "packet_boot_type" {
    default = "baremetal_0"
  }

  // Name your cluster!
  variable "dcos_cluster_name" {
    default = "packet-dcos"
  }

  // How many DC/OS master servers would you like?
  variable "dcos_master_count" {
    default= "1"
  }

  // How many DC/OS private agent servers would you like?
  variable "dcos_agent_count" {
    default = "2"
  }

  // How many DC/OS public agent servers would you like?
  variable "dcos_public_agent_count" {
    default = "1"
  }

  // The path to the private key you created
  variable "dcos_ssh_key_path" {
    default = "./dcos-key"
  }

  // The path to the public key you created
  variable "dcos_ssh_public_key_path" {
    default = "./dcos-key.pub"
  }

  // The path to the user-data script you created
  variable "user_data_path" {
    default = "./user-data.sh"
  }
```

# Step 6: Create Your DC/OS Configuration File

For this guide, we'll create a file called _dcos.tf_ that will house all of the necessary infrastructure configuration for our DC/OS cluster. The infrastructure configuration will use the variables we just created to deploy the necessary Packet servers, all of which will be running on CoreOS.

Create the file...

```bash

  touch ~/packet-terraform/dcos.tf
```

And, because we appreciate you! Here is another file... we won't break it down too much but you should definitely look through it and use the [Terraform docs](https://www.terraform.io/docs/index.html) if you'd like some clarification.

```js

  provider "packet" {
    auth_token = "${var.packet_api_key}"
  }

  resource "packet_device" "dcos_bootstrap" {
    hostname         = "${format("mesos-bootstrap-%02d.example.com", count.index + 1)}"
    operating_system = "coreos_beta"
    plan             = "${var.packet_boot_type}"
    user_data        = "${file("${var.user_data_path}")}"
    facility         = "${var.packet_facility}"
    project_id       = "${var.packet_project_id}"
    billing_cycle    = "hourly"

  }

  resource "packet_device" "dcos_master" {
    hostname         = "${format("mesos-master-%02d.example.com", count.index + 1)}"
    operating_system = "coreos_beta"
    plan             = "${var.packet_master_type}"

    count            = "${var.dcos_master_count}"
    user_data        = "#cloud-config\n\nssh_authorized_keys:\n  - \"${file("${var.dcos_ssh_public_key_path}")}\"\n"
    facility         = "${var.packet_facility}"
    project_id       = "${var.packet_project_id}"
    billing_cycle    = "hourly"
  }

  resource "packet_device" "dcos_agent" {
    hostname         = "${format("mesos-agent-%02d.example.com", count.index + 1)}"
    operating_system = "coreos_beta"
    plan             = "${var.packet_agent_type}"

    count            = "${var.dcos_agent_count}"
    user_data        = "#cloud-config\n\nssh_authorized_keys:\n  - \"${file("${var.dcos_ssh_public_key_path}")}\"\n"
    facility         = "${var.packet_facility}"
    project_id       = "${var.packet_project_id}"
    billing_cycle    = "hourly"
  }
```

**_Note, we're not deploying any DC/OS Public Agent Nodes - just private ones._**

# Step 5: Create an Output File

This will be super helpful when it's time to finish installing DC/OS. We'll be creating a file called _output.tf_ that will list variables to return once Terraform completes provisioning your infrastructure.

```bash

  echo '
  output "agent-private-ip-list" {
    value = "${join(",", packet_device.dcos_agent.*.network.2.address)}"
  }
  output "agent-public-ip-list" {
    value = "${join(",", packet_device.dcos_agent.*.network.0.address)}"
  }
  output "master-private-ip-list" {
    value = "${join(",", packet_device.dcos_master.*.network.2.address)}"
  }
  output "master-public-ip-list" {
    value = "${join(",", packet_device.dcos_master.*.network.0.address)}"
  }
  output "bootstrap-public-ip" {
    value = "${packet_device.dcos_bootstrap.network.0.address}"
  }
  output "Use this to access the web installer" {
    value = "http://${packet_device.dcos_bootstrap.network.0.address}:9000/"
  }
  ' >> ~/packet-terraform/output.tf
```

# Step 6: Terraform Magic

Once you're all setup the directory we're working from (_~/packet-terraform_ if you're following along!) should look like this

```bash

  |-- ~/packet-terraform
    |-- dcos.tf
    |-- dcos-key
    |-- dcos-key.pub
    |-- ip-detection.sh
    |-- output.tf
    |-- user-data.sh
    |-- vars.tf
```

Run `terraform plan` to check all the configuration files. If something is wrong you should get a pretty clear message that points you towards a fix.

If everything is good... go ahead and build your DC/OS cluster!

```bash

  terraform apply
```

Now we wait! Not long, probably around 7 minutes. You could check the status of the servers you just deployed from the Packet portal.

![](/media/images/rL7t-mesos.provisioning.jpg)

**_Note, once Terraform finishes its thing be sure to copy and save (or just don't clear out your terminal window) all the IP related output, you'll need it!_**

Looks like this ...

```bash

  Apply complete! Resources: 5 added, 0 changed, 0 destroyed.

  The state of your infrastructure has been saved to the path
  below. This state is required to modify and destroy your
  infrastructure, so keep it safe. To inspect the complete state
  use the `terraform show` command.

  State path: terraform.tfstate

  Outputs:

  agent-private-ip-list = 10.99.12.133,10.99.12.141
  agent-public-ip-list = 147.75.197.115,147.75.194.61
  bootstrap-public-ip = 147.75.105.5
  master-private-ip-list = 10.99.12.139
  master-public-ip-list = 147.75.194.67
  Use this to access the web installer = http://147.75.105.5:9000/
```

# Step 7: Setup DC/OS

Now that your DC/OS cluster is up you'll need to complete the installation via the swanky DC/OS installer located on your _mesos-bootstrap_ machine. Copy the the link given to you by the output variables printed when _terraform apply_ finished up, go to your favorite browser, and navigate to it!

You'll be prompted to complete some fields in the installer - they're all in the output! You're welcome.

Couple of things to note;

* The **Private SSH key** field is expecting the key you created at the beginning of this guide, _~/packet-terraform/dcos-key_.
* Your SSH Username is **core**, since we deployed using CoreOS.
* Set the **IP Detect Script** field by selecting _Custom Script_ from the drop down and selecting the ip-detection script we created above.

The rest should hopefully be pretty self-explanatory.

Here is an example of what it looks like completed.

![](/media/images/YcDS-mesos.settings.png)

Next hit the big green button!

At this point you should be getting pretty excited...

If all goes well you'll get no errors and you'll have to hit the big green button again...

And one last time, no errors, hit the big green button!

If everything has gone according to plan you should now be logging into your DC/OS management portal located on the master node.

![](/media/images/0ia3-mesos.dash.jpg)

# Step 8: Install the DC/OS CLI

To wrap up you'll need to install the DC/OS CLI - the way you go about that varies slightly and you can get OS dependant directions from Mesosphere [here](https://docs.mesosphere.com/1.8/usage/cli/install/). For this example we're using instructions for macOS Sierra.

Download the binary.

```bash

  cd /usr/local/bin/
  curl -O https://downloads.dcos.io/binaries/cli/linux/x86-64/dcos-1.8/dcos
```

Make the binary executable.

```bash

  chmod +x dcos
```

Point the CLI to the master node.

```bash

  ./dcos config set core.dcos_url http://147.75.194.67
```

Authenticate...

```bash

  ./dcos auth login
```

And that's it! You have just deployed an extremely powerful tool to help you manage large production scale infrastructure.

# Conclusion

You just walked through all the necessary components in deploying DC/OS using Terraform and should be more or less familiar with what that entails. You could also use this nifty [repo](https://github.com/dcos/packet-terraform) on your next go around - it houses everything we created but also installs DC/OS without the web browser.

Why not lead with the repo!?

Better to know what's happening so you can fix it when it breaks! ; )

Let us know what you think via the comments or email us at help@packet.net.
