<!-- <meta>
{
    "title": "Kubernetes Cluster API",
    "description": "Kubernetes Cluster API on Packet",
    "tag": ["Kubernetes", "Cluster"],
    "seo-title": "Kubernetes Cluster API for Packet - Packet Technical Guides",
    "seo-description": "Kubernetes Cluster API on Packet",
    "og-title": "Kubernetes Cluster API",
    "og-description": "Kubernetes Cluster API on Packet"
}
</meta> -->

# Kubernetes Cluster API on Packet

Packet is an [officially supported provider for the Kubernetes Cluster API](https://github.com/packethost/cluster-api-provider-packet). The Cluser API is an effort to make cluster bootstrapping declarative, while also using a single interface for a variety of Kubernetes providers (i.e. cloud providers like Packet, AWS, GCP, or provisioners like kubeadm).

The Cluster API, regardless of which provider backend is used, has a workflow that begins with your templates for the machines that will make up the configured cluster, templates for bootstrapping machines, and then the resources spawned from these templates, with options for traditional patterns like replication controllers to manage the deployment itself.

In practice, this results in things like multi-tenant clusters, templated access controls, and operations surrounding deploying multiple clusters of identical configurations automatable like any other part of your Kubernetes strategy.

Using the Packet provider, cluster configurations, infrastructure requirements, and things like certificate management, `Pod` and `Service` CIDRs, and addons can be checked into your cluster-api manifests. The result is that resources like ` MachineDeployment` as well as the cluster itself becomes manageable as YAML like other Kubernetes resources.

## Using Cluster API with Packet

The [Packet provider](https://github.com/packethost/cluster-api-provider-packet) details the steps and the templates used. The only requirements are your [Packet API key](https://www.packet.com/developers/api/), project ID, and the `kubectl` client installed on your machine.

You may use the [examples](https://github.com/packethost/cluster-api-provider-packet/tree/master/cmd/clusterctl/examples/packet) for Packet to quickly get up and running with clusterctl.

## Additional Resources

- [How Cluster API Promotes Self-Service Infrastructure](https://blogs.vmware.com/cloudnative/2019/12/12/how-cluster-api-promotes-self-service-infrastructure/)
- [The Cluster API Book](https://cluster-api.sigs.k8s.io/introduction.html)
- [Packet cluster-api Provider](https://github.com/packethost/cluster-api-provider-packet)
- [Packet Example Files for Cluster API](https://github.com/packethost/cluster-api-provider-packet/tree/master/cmd/clusterctl/examples/packet)

