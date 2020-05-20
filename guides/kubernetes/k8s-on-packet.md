<!-- <meta>
{
    "title":"Kubernetes on Packet",
    "description":"Kubernetes helps you make sure those containerized applications run where and when you want, and helps them find the resources and tools they need to work.",
    "tag":["Kubernetes"],
    "seo-title": "Kubernetes on Packet - Packet Technical Guides",
    "seo-description": "Kubernetes on Packet",
    "og-title": "Kubernetes on Packet",
    "og-description":"Kubernetes on Packet",
    "featured": true
}
</meta> -->

# Additional Kubernetes Resources
A number of projects developed by us, and our community, specifically tailored for the Packet platform are available, using common tooling like [Terraform](https://terraform.io) and [Ansible](https://www.ansible.com/), on our [Github](https://github.com/packethost) organization:

* [Kubernetes BGP](https://github.com/packet-labs/kubernetes-bgp): Kubernetes on Packet using Calico and MetalLB.
* [Multi-architecture Kubernetes](https://github.com/packet-labs/packet-multiarch-k8s-terraform): Deploy Kubernetes on Packet for ARM, x86, and GPU nodes.
* [Packet K3s](https://github.com/packet-labs/packet-k3s): Run K3s on Packet.
* [Rook on Bare Metal](https://github.com/packet-labs/Rook-on-Bare-Metal-Workshop): Workshop for running [Rook.io](https://rook.io) cloud-native storage on Bare Metal clusters.
* [Packet Helm Charts](https://github.com/packet-labs/helm-charts): Helm Charts for Packet platform clusters.

#### Plugins and Official Integrations

As the Kubernetes ecosystem matures, it has adopted formal specifications to help ensure a consistent experience across infrastructure providers and third party solutions.

* [Packet Cloud Controller Manager](https://github.com/packethost/packet-ccm): Allows clusters to interface and authenticate with Packet's APIs.
* [Packet Container Storage Interface](https://github.com/packethost/csi-packet): Create PersistentVolumes for Kubernetes from Packet's Block Storage offering using the [CSI](https://kubernetes.io/blog/2019/01/15/container-storage-interface-ga/) standard.
* [Cluster Autoscaler for Packet](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler/cloudprovider/packet): Autoscaling for worker node groups in your Kubernetes clusters.
* [Packet Cluster API provider](https://github.com/packethost/cluster-api-provider-packet): The Cluster API is a Kubernetes project to bring declarative, Kubernetes-style APIs to cluster creation, configuration, and management. It provides optional, additive functionality on top of core Kubernetes.

#### Non-Commercial Deployment Solutions

Kubernetes is free, but sometimes deploying and managing it takes work.  A number of projects and distributions exist to help ease that operational pain - here are some that are validated against Packet (note: this is an easily outdated list):

* [Kubeadm](https://v1-16.docs.kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm/): kubeadm bootstraps a minimal Kubernetes cluster, meeting conformance standards, and automating many cluster operations through its toolchain.
* [Lokomotive](https://github.com/kinvolk/lokomotive-kubernetes): an open source project by [Kinvolk](https://kinvolk.io/) which distributes pure upstream Kubernetes.
* [Rancher Kubernetes Engine (RKE)](https://rancher.com/docs/rke/latest/en/): RKE solves the problem of installation complexity, a common issue in the Kubernetes community. With RKE, the installation and operation of Kubernetes is both simplified and easily automated, and it’s entirely independent of the operating system and platform you’re running.
* [Crossplane](https://crossplane.io/): Manage cluster deployments across cloud providers.
* [K3s](https://k3s.io/): Lightweight certified Kubernetes distribution for IoT & Edge computing.
* [Kubespray](https://kubespray.io/): runs perfectly on Packet, using Ansible as its substrate for provisioning and orchestration. Kops performs the provisioning and orchestration itself, and as such is less flexible in deployment platforms.
* [Pharmer](https://pharmer.io/): a technical preview from Appscode of a Kubernetes cluster manager for kubeadm. Pharmer lets you set up, tear down, and scale clusters up and down on Packet.
* [Kubernetes on DC/OS](https://github.com/mesosphere/dcos-kubernetes-quickstart): A package to deploy Kubernetes cluster in your [DC/OS](https://github.com/mesosphere/dcos-kubernetes-quickstart) environment.

#### Commercial Deployment Solutions

* [Loodse](https://www.loodse.com/): Enterprise software that automates multicloud, on-prem, and edge operations with a single management UI for Kubernetes.
* [Platform9](https://platform9.com): Packet works closely with Platform9, a managed cloud provider, to enable users with Kubernetes, Openstack, and Serverless solutions.
* [Cloud66](https://www.cloud66.com/): London-based Cloud66 offers a managed Kubernetes container service called Maestro, which is tested against Packet.
* [RedHat OpenShift](https://www.openshift.com/): OpenShift is an open source container application platform by Red Hat based on the Kubernetes container orchestrator for enterprise app development and deployment.

#### Community

Packet is actively involved in supporting the cloud native space, including Kubernetes.

* [CNCF Community Infrastructure Lab](https://www.cncf.io/community/infrastructure-lab/): Packet donates $25,000 per month in compute resources that are available to the CNCF and broader open source community.
* [CNCF Cross Cloud CI](https://cncf.ci/) - Packet is represented as the only bare metal cloud on the this unique dashboard, which shows the results of a sample implementation of the CNCF project stack against various providers.
