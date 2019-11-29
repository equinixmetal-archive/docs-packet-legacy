<!--<meta>
{
    "title":"Deploy: without Public IP",
    "description":"Deploying Devices With No Public IP.",
    "tag":["Deploy", "No IP"]
}
</meta>-->


The servers provisioned on Packet gets allocated a public IPv4 and IPv6 address by default. However, there are scenarios where the server is deployed in a restricted environment and expected to have no public internet access. The “Deploy without public IP feature” does exactly that by provisioning a server without any public IP on it.  This works for On-demand servers as well as reserved hardware and spot instances.

This is currently supported on the servers booting with the OS listed below:

CentOS7, Debian 8/9, openSUSE 42, Scientific Linux, RHEL 7, Ubuntu 14,16,17,18

Should you attempt to use a non-supported operating system without a public IPv4 address, it will receive an error like “Public IPv4 is required ”.

 In order to deploy without public IPv4 or public IPv6, uncheck those boxes and select the desired Private IPv4 subnet range.

![deployment options](/images/deploy-without-public-ip/Deploy-Sans-Pub-IP.png)

 The Deploy without Public IPv4 feature is also supported [through the API](https://gist.github.com/usrdev/d378864d07ef10332f33f67a5ed05145).
