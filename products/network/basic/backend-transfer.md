<!--<meta>
{
    "title":"Backend Transfer",
    "description":"Setting Up & Using Backend Transfer on Packet",
    "date": "09/20/2019",
    "tag":["Backend Transfer", "Private Network"]
}
</meta>-->

# Backend Transfer

All servers within a Project can talk to each other via private RFC1918 address space \(e.g. 10.x.x.x\), but cannot communicate over private address space by devices outside of that Project.  This is also referred to as "backend" networking.

This feature ensures that when you're communicating between servers, you are able to do so in a private / secure manner without needing to worry about establishing VPN tunnels or sending data over the public internet.

The only restriction is that all servers must be within a single project.

## What is Backend Transfer?

Backend Transfer extends the normal private / backend transfer capability across our global facilities.

This means you can use the same easy and secure method to communicate between servers in a project, even if they are not located in the same datacenter.

## Is there a cost to Backend Transfer?

Backend transfer within a facility is always free, since no bandwidth leaves the datacenter. When transferring data our global facilities, we have to move that traffic across our network.  As such, bandwidth is billed on a usage basis at a reduced rate of **$0.03/GB**. There are no monthly or other fees associated with Global Backend Transfer - just the cost of sending data between facilities.

Please [contact us](mailto:support@packet.com) if you are expecting to be transferring large volumes of data between sites, to ensure that we can offer you the most cost-effective price on related traffic.

## How do I enable Backend Transfer?

In the client portal, browse to the IPs & Networks page, and then the Backend Transfer tab, for the project you wish to enable backend transfer on, and then click the toggle icon in the upper right-hand corner.

![46221MMBKSYJMBGSQGYP0-1539907677144.png](https://deskpro-cloud.s3.amazonaws.com/files/26944/47/46221MMBKSYJMBGSQGYP0-1539907677144.png)

Backend transfer will be enabled on your project immediately, although you may have to wait up to 1 minute for backend connectivity to be established.

## How do I use Backend Transfer?

Enable backend transfer on your project, then deploy two or more servers in the same project in geographically diverse datacenters.  Once you have done this, you will be able to communicate between them using the assigned private IPv4 addresses. For example:

**Server in NRT1:**

```text
be-nrt1:~$ ip a s bond0
4: bond0: <BROADCAST,MULTICAST,MASTER,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default qlen 1000
    link/ether 0c:c4:7a:81:0a:f6 brd ff:ff:ff:ff:ff:ff
    inet 147.75.92.103/31 brd 255.255.255.255 scope global bond0
       valid_lft forever preferred_lft forever
    inet 10.64.54.1/31 brd 255.255.255.255 scope global bond0:0
       valid_lft forever preferred_lft forever
    inet6 2604:1380:3000:4f00::1/127 scope global
       valid_lft forever preferred_lft forever
    inet6 fe80::ec4:7aff:fe81:af6/64 scope link
       valid_lft forever preferred_lft forever
be-nrt1:~$ curl -s https://metadata.packet.net/metadata | jq '.facility'
"nrt1"
```

**Server in EWR1, pinging a server in NRT1:**

```text
be-ewr1:~$ curl -s https://metadata.packet.net/metadata | jq '.facility'
"ewr1"
be-ewr1:~$ ping -c 1 10.64.54.1
PING 10.64.54.1 (10.64.54.1) 56(84) bytes of data.
64 bytes from 10.64.54.1: icmp_seq=1 ttl=56 time=166 ms

--- 10.64.54.1 ping statistics ---
1 packets transmitted, 1 received, 0% packet loss, time 0ms
rtt min/avg/max/mdev = 166.729/166.729/166.729/0.000 ms
```

## Are communications between facilities secure?

Yes. Packet maintains private links between our datacenters that bypass the public internet. In addition we manage ACLs to isolate communications between projects - keeping your backend networking truly private!
