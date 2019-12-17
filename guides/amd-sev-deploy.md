<!--
<meta>
{
    "title":"AMD Sev with Anjuna",
    "description":"Deploying AMD SEV with Anjuna",
    "author":"Mo Lawler",
    "github":"usrdev",
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
    
* Select the Deploy Servers option.

#### Host setup

###### ⚠️ Note: SEV support is available in Linux kernel 4.16 and onwards.

Our Ubuntu 18.04 image comes with 4.15 kernel. The following will get your instance configured with the SEV supported version fo 4.16. 

```
cd /tmp/

wget -c http://kernel.ubuntu.com/~kernel-ppa/mainline/v4.16/linux-headers-4.16.0-041600_4.16.0-041600.201804012230_all.deb

wget -c http://kernel.ubuntu.com/~kernel-ppa/mainline/v4.16/linux-headers-4.16.0-041600-generic_4.16.0-041600.201804012230_amd64.deb

wget -c http://kernel.ubuntu.com/~kernel-ppa/mainline/v4.16/linux-image-4.16.0-041600-generic_4.16.0-041600.201804012230_amd64.deb

sudo dpkg -i *.deb
```
Reboot the device one the headers/kernel is installed. Upon reboot, issue a `uname -a` you should see the following: 

```
Linux hostname 4.16.0-041600-generic #201804012230 SMP Sun Apr 1 22:31:39 UTC 2018 x86_64 x86_64 x86_64 GNU/Linux
```

Add: 

```
mem_encrypt=on kvm_amd.sev=1
```
to `/etc/defaults/grub` on the 

```
GRUB_CMDLINE_LINUX_DEFAULT=
```

then regenerate your grub configuration by issuing: 

```
grub-mkconfig -o /boot/grub2/grub.cfg
```
Another system reboot is required. When the device is accessible again, the following steps will clone the AMDSEV repo and build it out. Including all the necessary depdents and correct versions of libvert and qemu. 

```
git clone https://github.com/AMDESE/AMDSEV.git
```
```
cd AMDSEV/distros/ubuntu-18.04
```
```
./build.sh
```
**NOTE:** This build script downloads source tarballs and builds from source, this can take ~20 minutes. 



Once the build script has completed use the following commands to verify that the system supports SEV:

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

<br><br><br>

<center>![deploy-anjuna-logo](/images/amd-sev/anjuna-logo.png)</center>
