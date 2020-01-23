<!-- <meta>
{
     "title":"AMD Sev with Anjuna",
    "description":"Deploying AMD SEV with Anjuna",
    "tag":["AMD", "SEV"],
    "seo-title": "Deploy AMD SEV on Bare Metal- Packet Technical Guides",
    "seo-description": "Deploying AMD SEV with Anjuna",
    "og-title": "AMD Sev with Anjuna",
    "og-description": "Deploying AMD SEV with Anjuna"
}
</meta> -->

AMD SEV is a powerful technology that provides an unprecedented level of security for confidential workloads. [Anjuna](https://www.anjuna.io) abstracts the low-level details and further leverages SEV to provide a hardware-grade security perimeter around the application itself, eliminating concerns about the security of the host itself, and potential attackers that obtain full control of the host OS or hypervisor.


### Deploying AMD SEV enabled instances on Packet with Anjuna

From the deploy screen, ensure you are selecting c2.med as this is the only device where AMD is found.

![deploy-amd](/images/amd-sev/deploy-amd.png)

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

* Select the Deploy Servers option.

Follow the build process by coonnecting to the [SOS Console](https://www.packet.com/developers/docs/servers/key-features/sos-serial-over-ssh/). Building SEV can take ~20 minutes. When the build completes and  to activate the SEV kernel a reboot must be issued. 

Verify `/dev/sev` exists: 

```
$ ls -l /dev/sev
crw------- 1 root root 10, 55 Oct 21 15:06 /dev/sev
```
Verify SEV is active in KVM: 
```
$ dmesg | grep SEV
SVM: SEV supported
```


