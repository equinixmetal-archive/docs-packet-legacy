<!--
<meta>
{
    "title":"User Data",
    "description":"Run commands during the server provisioning process.",
    "tag":["user", "data"]
}
</meta>
-->
When provisioning a server at Packet you have the option to include User Data, which can be used to perform various automation tasks after the server is ready, such as executing common scripts / packages, or triggering other more advanced configuration processes.

User data - like other forms of instance “meta data” - is tied into Packet’s extensive use of cloud-init.  Designed in the early days of AWS, Cloud-init is a simple but powerful technique for carrying out actions on a cloud instance at boot time.  It takes care of defining each machine’s hostname, adds SSH keys, and performs the “phone home” process when the server finishes provisioning.

User Data allows you to influence and augment this critical part of the server provisioning process.


### Usage

Userdata takes two different forms:

User Data Script

* Typically used by those who just want to execute a shell script.
* Begins with: #!

Cloud Config Data

* Using valid yaml syntax, you can specify certain things in a human friendly format.
* Begins with: #cloud-config


When provisioning a new server from the Packet Portal, you will find the option to add userdata under Manage:

![User Data Field](/images/user-data/User-Data.png)

On the other hand, if you want to provision a server via our API, you can add userdata by simply using the "userdata": "string" in the body of the call.


### Example Usage: Deploying Nginx

**User Data Script**

```
#!/bin/bash
export DEBIAN_FRONTEND=noninteractive
apt-get update && apt-get upgrade -y
apt-get install nginx -y
```

**Cloud-Config**

```
#cloud-config
package_upgrade: true
packages:
    -  nginx
```

Once the server provisions, you should be able to hit the web server on the Public IP.

### Inithub

While user data is a great way to automate various configuration tasks on the servers, the more complex these scripts get, the harder it is to use it when provisioning through the API, and also, it takes more time for you to validate it, and make sure there are no errors.

Inithub.org is a simple free tool that works like a "Docker hub for your cloud-init." Store snippets in inithub.org and reference a single, concise url in your automation instead of a massive blob of code. Other benefits include built-in validation, version control, and easier access to some of cloud-init's more powerful (but hidden) features.

### Troubleshooting Tips

The first thing to keep in mind when using any form of user data, is that depending on the length of your script, you need to give it some time to execute after seeing the server as “Active” in the Packet portal.

If you need to check whether the server has downloaded the user-data at all, you can check

`/var/lib/cloud/instance/user-data.txt`

Any form of user data will only run on the first boot, and you won’t be able to rerun it again later on the same server.

If you need to troubleshoot any issues, the log files where you can get any needed information are

`/var/log/cloud-init.log and /var/log/cloud-init-output.log`
