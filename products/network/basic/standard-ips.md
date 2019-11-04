<!--<meta>
{
    "title":"IPs: Overview",
    "description":"IP addresses at Packet",
    "date": "09/20/2019",
    "tag":["Network", "IPs"]
}
</meta>-->

When a Packet server is installed, we configure management IP addresses by default. These IPs are for accessing a server administratively, for example, via SSH. It is important to consider that these IPs live and die with a server -- when a server instance is deleted, its management IPs also cease to exist, and may not necessarily be assigned to any new servers created.

We also allow our customers to provision supplementary elastic IP addresses. These are special addresses which can move between servers in a project. Elastic IPs are recommended for any workload where permanent reachability is required, for example, hosting a public-facing web site behind a load balancer, or directing clients to a clustered database server internally.

### Types of IP Addresses at Packet

IP addresses come in many colors, shapes, and sizes, and one size does not necessary fit all.   One important distinction is "free" vs "paid".  The following IP address assets are free:

* Public IPv4 - These are public-facing Internet addresses. Unlike other cloud hosting providers, we provide raw, unfettered, access to the Internet, without any firewalling or Network Address Translation (NAT).  Each new server is provisioned with a single public IPv4.  This IP address cannot be retained after you delete a server.

* Private IPv4 - These are internal (10.x.x.x) IP addresses, provided at no charge. A client project is pre-provisioned with a /25 by default; we’ll automatically replenish your supply with additional /25s as you spin up additional resources. Client servers are able to reach other private IPs belonging to their project, however clients are unable to communicate with other projects or Packet customers at these addresses.

* Public IPv6 - We assign a (publicly routable) /56 on the project level, which is divisible into 256 /64s (“LAN subnets” in IPv6 parlance), each routable to a server. IPv6 addressing is also provided at no charge.

If you want retain your IP addresses and move them between servers (or facilities). In this case we have both "local" and "global" elastic IP addresses, which you rent from Packet on an hourly basis:

* Elastic IPs - Clients can use our customer portal to order additional public IPv4 address space, ranging from a /32 (a single IP) through a /24 (256 IPs). Though there is no technical limit to how these IPs can be configured, we encourage you to use them responsibly, and as such we charge a nominal fee per elastic IP address ($0.005/hr or about $3.60/mo).  Usage details below.

* Global Anycast IPs - Global Anycast IPs are public IPv4 addresses that are pulled from Packet-owned IP space and announced in all of Packet's core facilities. These IPv4 addresses cost $0.15/hr per IP.  Regular $0.05/GB outbound rates apply, and (in addition) inbound bandwidth to Global Elastic IPs costs $0.03/GB.  Read more.