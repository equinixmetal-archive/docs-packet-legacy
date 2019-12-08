<!--<meta>
{
    "title":"Elastic Block Storage",
    "description":"Overview of our Storage Offering",
    "tag":["EBS", "Block storage"]
}
</meta>-->

Packet's Block Storage service looks and smells a lot like Amazon’s EBS. You can create volumes of different performance profiles, leverage snapshot policies and more - all via our API or portal.  The service is highly redundant.

Comparing our block storage service to similar offerings at other clouds, an important difference is that at Packet you don’t have the benefit of a platform-managed hypervisor layer (we only offer bare metal compute and never leave an agent or any other tools/software on your server after it is deployed).

As such, there is a bit more you should know about how to troubleshoot or deal with any issues that may arise.  Check out the tips below.


### Performance Tiers

When you need persistent storage, with built-in replication and snapshots, our block storage product is a very useful tool.  We offer two performance tiers:

* Standard Tier ($0.000104/GB per hour) - With 500 IOPS per volume this is good for backups, dev/test, and medium use datasets.

* Premium Tier ($0.000223/GB per hour) - With 15,000 IOPS per volume this is targeted at higher I/O heavy workloads.


### Use Cases

While our Block Storage product is the perfect match for a wide variety of use cases, the first and most important step is to understand when *not* to use block storage at Packet.

As a general rule of thumb, databases are not a good fit for our Block Storage, especially those that are not resilient due to minor hiccups.  While uncommon, even a small loss of connectivity to some databases can cause major issues.  

If block storage doesn't meet your needs, we offer two other options:

* Various local disk options (SSD's and NVMe Flash) on each server config.

* The s1.large storage-focused server includes 24 TB of SATA w/ SSD's for cache.<br><br>

### Additional Resources

<br>

| Source  | Content |
| ------------- | ------------- |
| [Elastic Block Storage Guide](http://staging.packet.net/resources/guides/elastic-block-storage/) | How to setup, create, attach storage volume |
| [Extending Block Storage Volume Guide](http://staging.packet.net/resources/guides/extending-blockstorage) | How to extend existing storage volume|
