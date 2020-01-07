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

Enable source repositories & update

```
sed -i '/deb-src/s/^# //' /etc/apt/sources.list && apt update
```

Clone the repo
```
git clone https://github.com/AMDESE/AMDSEV.git
```

From within the cloned repo

```
./build.sh
```

This will take sometime to complete, when it is reboot the device.

```
shutdown -r now
```
When the device becomes active double check that SEV is supported on your device.

```
dmesg | grep SEV
```
```
[    4.834725] ccp 0000:06:00.2: SEV API:0.17 build:22
[    5.377732] SVM: SEV supported
```

You may proceed with standing up VMs on your SEV enabled device.

**NOTE:** If you

#### Additional Resrouces
* SEV AMD: [Github](https://github.com/AMDESE/AMDSEV)
