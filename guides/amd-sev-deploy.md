<!--
<meta>
{
    "title":"AMD Sev with Anjuna",
    "description":"Deploying AMD SEV with Anjuna",
    "author":"Mo Lawler",
    "github":"usrdev",
    "date": "2019/11/11",
    "email":"mo@packet.com",
    "tag":["AMD", "SEV"]
}
</meta>
-->

AMD SEV is a powerful technology that provides an unprecedented level of security for confidential workloads. [Anjuna](http://.anjuna.io) abstracts the low-level details and further leverages SEV to provide a hardware-grade security perimeter around the application itself, eliminating concerns about the security of the host itself, and potential attackers that obtain full control of the host OS or hypervisor.

## Deploying AMD SEV enabled instances on Packet with Anjuna

From the deploy screen, ensure you are selecting c2.med as this is the only device where AMD is found.

![deploy-amd](/images/amd-sev/deploy-amd.png)

* Hostname: (any name, this is an internal name used only to identify your Packet instance).

* Location: any location (preferably one that is geographically close to you) that offers the c2.medium host type (see below).

* Type: You **MUST** select c2.medium as it uses an AMD EPYC processor that supports SEV (see https://www.packet.net/bare-metal/servers/ for available hardware).

* OS: Ubuntu 18.04 LTS.
    Provide some extra data to provision the newly created host. Select the SSH & USER DATA option and add the following user data (this will automatically provision some users when the host is provisioned):


```
#cloud-config
users:
  - name: "sev"
    sudo: ALL=(ALL) NOPASSWD:ALL
    groups:
      "sudo"
package_update: true
packages:
 - git
 - flex
runcmd:
  - [cd, /home/sev]
  - [git, clone, --single-branch, -b, master, "https://github.com/AMDESE/AMDSEV.git"]
  - [cd, AMDSEV/distros/ubuntu-18.04]
  - [./build.sh]
```
* Select the Deploy Servers option.


#### Setting up the host

If you used the cloud-config script above when provisioning the server, you may skip some of the following steps.

#### Basic host setup

###### ⚠️ Note: SEV support is available in Linux kernel 4.16 and onwards.

Run the following commands to verify that the system supports SEV:

```
# verify the /dev/sev exist
$ ls -l /dev/sev
crw------- 1 root root 10, 55 Oct 21 15:06 /dev/sev

# verify that SEV is enabled in KVM.
$ dmesg | grep SEV
SVM: SEV supported
```
Run sudo apt update to get the latest version of the packages (required for some of the development tools to compile the AMD SEV software stack):

```
$ sudo apt update
```

#### Create a user with sudo privileges
If you did not opt for utilizing the cloud-config you would need to proceed with the following. 
```
$ sudo useradd -m sev
$ sudo passwd sev
$ sudo usermod -aG sudo sev
```

#### Install prerequisites

```
sudo apt install git flex
```

#### Clone and build QEMU with SEV support
Follow [these steps](https://github.com/AMDESE/AMDSEV) to clone and build versions of QEMU and KVM that support Secure Encrypted Virtualization.

## Automate Deployment on Packet using Terraform

[Terraform](https://hashicorp.com/terraform) is an extremely convenient tool for defining infrastructure as code. Using Terraform you can essentially provision a new AMD EPYC server on Packet with a single shell command, as described below:

* Download & install Terraform
* Open a command shell and create a new directory, such as:
```
$ mkdir amd-epyc-packet
$ cd amd-epyc-packet
```
###### ⚠️ Note: You can choose your own name for the directory

Next up, we will create three configuration files: cloudinit.cfg, packet.tf, and userconfig.tf

**cloudinit.cfg:** 
```
#cloud-config
bootcmd:
  - echo 127.0.1.1 cloud.init > /etc/hosts
users:
  - name: "sev"
    sudo: ALL=(ALL) NOPASSWD:ALL
    groups:
      "sudo"
package_update: true
packages:
 - git
 - flex
runcmd:
  - [cd, /home/sev]
  - [git, clone, --single-branch, -b, master, "https://github.com/AMDESE/AMDSEV.git"]
  - [cd, AMDSEV/distros/ubuntu-18.04]
  - [./build.sh]
```

**packet.tf**
```
# Configure the Packet Provider
provider "packet" {
  auth_token = "${var.packet_api_key}"
}
# Create a device and add it to project
resource "packet_device" "epyc_server" {
  hostname         = "epyc.ubuntu"
  plan             = "c2.medium.x86"
  facilities       = ["${var.packet_facility}"]
  operating_system = "ubuntu_18_04"
  billing_cycle    = "hourly"
  project_id       = "${var.packet_project_id}"
  user_data        = "${file("./cloudinit.cfg")}"
}
```

**userconfig.tf**
```
variable "packet_api_key" {
  description = "Your packet API key"
}

variable "packet_project_id" {
  description = "Packet Project ID"
}

variable "packet_facility" {
  description = "Location - US East (ewr1), US West (sjc1), or EU (ams1)"
  default = "sjc1"
}
```

**output.tf**
```
output "server-ip" {
   value = "${packet_device.epyc_server.network.0.address}"
}

```

Initialize Terraform inside the directory:
```
$ terraform init
```

Provision an instance by running:
```
$ terraform apply
```

###### ⚠️ Note: You can later on destroy the instance by running: 
```
$ terraform destroy
```
from within Terraform directory. 

<br> 
<br>
<br>
<br>

![deploy-anjuna-logo](/images/amd-sev/anjuna-logo.png)
