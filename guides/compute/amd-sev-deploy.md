<!-- <meta>
{
    "title": "AMD Sev with Anjuna",
    "description": "AMD SEV is a unprecedented level of security for confidential workloads. Learn how to deploy it on Packet.",
    "tag": ["AMD", "SEV"],
    "seo-title": "Deploy AMD SEV on Bare Metal- Packet Technical Guides",
    "seo-description": "Deploying AMD SEV with Anjuna",
    "og-title": "Deploy AMD SEV with Anjuna on Packet.",
    "og-description": "In this Technical Guide, learn to leverage AMD's Secure Encrypted Virtualization (SEV) for encrypting the memory of virtual machines"
}
</meta> -->

AMD SEV is a powerful technology that provides an unprecedented level of security for confidential workloads. [Anjuna](https://www.anjuna.io) abstracts the low-level details and further leverages SEV to provide a hardware-grade security perimeter around the application itself, eliminating concerns about the security of the host itself, and potential attackers that obtain full control of the host OS or hypervisor.


### Deploying AMD SEV enabled instances on Packet with Anjuna

From the deploy screen, ensure you are selecting c2.med as this is the only device where AMD is found.

![deploy-amd-1](/images/amd-sev/amd-sev-anjuna-portal-new-1.png)
![deploy-amd-2](/images/amd-sev/amd-sev-anjuna-portal-new-2.png)

* Hostname: (any name, this is an internal name used only to identify your Packet instance).

* Location: any location (preferably one that is geographically close to you) that offers the c2.medium host type (see below).

* Type: You **MUST** select [c2.medium](https://www.packet.com/cloud/servers/c2-medium-epyc/) as it uses an AMD EPYC processor that supports SEV.

* OS: Ubuntu 18.04 LTS.

* Provide some extra data to provision the newly created host. Select the SSH & USER DATA option and add the following user data (this will automatically provision some users when the host is provisioned):

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
 - apt-utils
write_files:
 - path: /tmp/debconf.cfg
   permissions: 0644
   content: |
     debconf debconf/frontend select Noninteractive
runcmd:
  - [debconf, /tmp/debconf.cfg]
  - [cd, /home/sev]
  - [git, clone, --single-branch, -b, master, "https://github.com/AMDESE/AMDSEV.git"]
  - [cd, AMDSEV/distros/ubuntu-18.04]
  - [./build.sh]
  ```
Follow the build process by coonnecting to the [SOS Console](https://www.packet.com/developers/docs/servers/key-features/sos-serial-over-ssh/). Building SEV can take ~20 minutes. When the build completes and to activate the SEV kernel a you must upgrade to 4.16.x kernel.

````
cd /tmp/

wget -c http://kernel.ubuntu.com/~kernel-ppa/mainline/v4.16/linux-headers-4.16.0-041600_4.16.0-041600.201804012230_all.deb

wget -c http://kernel.ubuntu.com/~kernel-ppa/mainline/v4.16/linux-headers-4.16.0-041600-generic_4.16.0-041600.201804012230_amd64.deb

wget -c http://kernel.ubuntu.com/~kernel-ppa/mainline/v4.16/linux-image-4.16.0-041600-generic_4.16.0-041600.201804012230_amd64.deb

sudo dpkg -i *.deb
````

Once the kernel is installed, a system reboot will be required to active the support 4.16.x kernel.

````
shutdown -r now
````

When access is restored, verify `/dev/sev` exists:

````
$ ls -l /dev/sev
crw------- 1 root root 10, 55 Oct 21 15:06 /dev/sev
````

Also verify SEV is active in KVM:
````
$ dmesg | grep SEV
[    5.563511] ccp 0000:02:00.2: SEV API:0.17 build:1
[    6.021164] SVM: SEV supported
````
