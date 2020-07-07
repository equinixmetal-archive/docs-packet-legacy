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
Kubernetes On Packet
--------------------

-   [Kubernetes](#whatiskubernetes)

-   [Kubernetes and
    Packet Together](#kubernetesandpacket)

-   [What are my options on
    Packet?](#options)

    -   [Upstream](#upstream)

    -   [Distributions and
        Deployers](#distribution)

    -   [Managed Kubernetes
        Services](#services)

-   [The Packet Kubernetes
    Ecosystem](#ecosystem)

    -   [Plugins and Official
        Integrations](#plugins)

    -   [Non-Commercial Deployment
        Solutions](#noncommercial)

    -   [Commercial Deployment
        Solutions](#commercial)

    -   [Packet and the Community](#community)

-   [Common Questions](#faq)

    -   [Can I Use Packet With My Kubernetes
        Stack?](#q1)

    -   [Does Packet Have a Managed Kubernetes
        Service?](#q2)

    -   [Is Kubernetes on Packet Mature and
        Up To Date?](#q3)

    -   [Can I use
        Deployers?](#q4)


<br>**What is Kubernetes?**{#whatiskubernetes}
---------------------------

[Kubernetes](https://kubernetes.io/) is the modern standard for:

-   Describing how applications should be deployed and run.

-   Orchestrating or managing the described deployments.

Kubernetes is a tool that helps enable continuous deployment and continuous
integration (for reducing release cycle times, streamlining infrastructure, and
increasing efficiency).

Kubernetes ensures that your applications are always either in the described
state or converging to that state.

**Kubernetes and Packet Together**
----------------------------------

Kubernetes is a natural fit for Packet. With all of the power and control
available to you with a bare-metal cloud, Kubernetes is the control plane that
enables you to deploy your applications in a standard cloud-native way, taking
advantage of both the power of bare metal and the flexibility and control of
cloud-native.

Kubernetes on bare metal does not operate any differently than on VMs - provided
you have a cloud provider interface to manage the bare metal. Kubernetes relies
on interacting with your cloud provider to check the state of your servers,
deploy or remove load balancers and do other important management tasks. You
*can* run Kubernetes on bare metal for significant benefits (see the next
section) but you will lose much of the Kubernetes management benefits unless you
have a cloud provider interface to empower Kubernetes to work with your bare metal.

Packet provides a cloud provider interface together with bare metal to make the
best Kubernetes experience possible.

**What are My Options on Packet?**
----------------------------------

You have three high-level options.

### **Upstream**

If you want, you can download [the official pure upstream
Kubernetes](https://kubernetes.io/docs/setup/), install the Packet integrations,
and work with it directly. You can also use any of the official installers or
deployment tools, including kubeadm and kubespray.

The official Kubernetes distribution works cleanly on Packet, and the Packet
integrations provide a seamless experience for working with Packet as a cloud
provider.

Find some of our core supported upstream tools below:

-   [Kubernetes
    Autoscaler](https://www.packet.com/developers/integrations/official-kubernetes/cluster-autoscaler/)

-   [Kubernetes Cloud Controller
    Manager](https://www.packet.com/developers/integrations/official-kubernetes/ccm/)

-   [Kubernetes Cloud Storage
    Interface](https://www.packet.com/developers/integrations/official-kubernetes/csi/)

-   [Kubernetes Cluster API
    Provider](https://www.packet.com/developers/integrations/official-kubernetes/cluster-api/)

-   [MetalLB](https://metallb.universe.tf/)

-   [Portworx](https://portworx.com/)

-   [StorageOS](https://storageos.com/)

### **Distributions and Deployers**

There are several certified Kubernetes distributions that either simplify the
deployment of Kubernetes, or tailor it to a specific need. Many of them have
been verified to work both *on* and *with* Packet, and ease your path to
deployment.

In addition, several Kubernetes deployment software systems, such as
[Rancher](https://rancher.com/) and [Gardener](https://gardener.cloud/) can
deploy and manage Kubernetes for you, as well as the official [Cluster API for
Packet](http://github.com/packethost/cluster-api-provider-packet).

Finally, some software will do *both*, providing a distribution and deployment
control.  
  
Find some of our core supported Distribution and Deployer tools below:

-   [Kubespray](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/packet.md)

-   [Gardener](https://www.packet.com/developers/integrations/container-management/gardener/)

-   [K3s](https://github.com/rancher/k3s)

-   [Kubermatic](https://www.packet.com/developers/integrations/container-management/kubermatic/)

-   [Lokomotive](https://github.com/kinvolk/lokomotive-kubernetes)

-   [Openshift](https://www.openshift.com/)

-   [Google Anthos](https://cloud.google.com/anthos)

### **Managed Kubernetes Services**

For the most hands-off approach, a number of providers offer managed Kubernetes
services, including, in some cases, multi-cloud. With these services, you sign
up, click a few buttons, and they manage your clusters and infrastructure from a
single pane of glass.  
  
Find some of our managed Kubernetes services and additional service tools below:

-   [Cloud66](https://www.cloud66.com/)

-   [Cycle.io](https://cycle.io/)

-   [Helm-Charts](https://www.packet.com/resources/guides/kubernetes-helm-charts-on-packet/)

-   [Mist.io](https://github.com/mistio)

-   [Weave Kubernetes Service](https://www.weave.works/)

**Getting Started**
-------------------

Looking to get started with Kubernetes on Packet? Check out our guides:

-   [Install Upstream Kubernetes on Packet](https://gist.github.com/usrdev/5b83646687a92ef7bc90e1c1d811f0ce)
-   [K3s on Packet](https://www.packet.com/resources/guides/k3s-on-packet/)

**Our Kubernetes Ecosystem**
----------------------------

#### **Our Plugins and Official Integrations**

As the Kubernetes ecosystem matures, it has adopted formal specifications to
help ensure a consistent experience across infrastructure providers and third
party solutions. We have created various integrations to give you more control
over Kubernetes on Packet.

-   [Packet Cloud Controller Manager](https://github.com/packethost/packet-ccm):
    Allows clusters to interface and authenticate with Packet's APIs.

-   [Packet Container Storage
    Interface](https://github.com/packethost/csi-packet): Create
    PersistentVolumes for Kubernetes from Packet's Block Storage offering using
    the
    [CSI](https://kubernetes.io/blog/2019/01/15/container-storage-interface-ga/)
    standard.

-   [Cluster Autoscaler for
    Packet](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler/cloudprovider/packet):
    Autoscaling for worker node groups in your Kubernetes clusters.

-   [Packet Cluster API
    provider](https://github.com/packethost/cluster-api-provider-packet): The
    Cluster API is a Kubernetes project to bring declarative, Kubernetes-style
    APIs to cluster creation, configuration, and management. It provides
    optional, additive functionality on top of core Kubernetes.

-   [MetalLB](https://metallb.universe.tf/): A load-balancer implementation for bare metal Kubernetes clusters, using standard routing protocols.

**Our Projects**  
A number of projects and example deployments are available that have been developed by us with our
community. These are specifically tailored for the Packet platform using common
tooling like [Terraform](https://terraform.io/) and
[Ansible](https://www.ansible.com/) and can be found on our
[Github](https://github.com/packethost) organization:

-   [Kubernetes BGP](https://github.com/packet-labs/kubernetes-bgp): Kubernetes
    on Packet using Calico and MetalLB.

-   [Multi-architecture
    Kubernetes](https://github.com/packet-labs/packet-multiarch-k8s-terraform):
    Deploy Kubernetes on Packet for ARM, x86, and GPU nodes.

-   [Packet K3s](https://github.com/packet-labs/packet-k3s): Run K3s on Packet.

-   [Rook on Bare
    Metal](https://github.com/packet-labs/Rook-on-Bare-Metal-Workshop): Workshop
    for running [Rook.io](https://rook.io/) cloud-native storage on Bare Metal
    clusters.

-   [Packet Helm Charts](https://github.com/packet-labs/helm-charts): Helm
    Charts for Packet platform clusters.

#### **Non-Commercial Deployment Solutions**

Kubernetes is free, but sometimes deploying and managing it takes work. A number
of projects and distributions exist to help ease that operational pain. Here
are some that are validated against Packet:

-   [Kubeadm](https://v1-16.docs.kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm/):
    kubeadm bootstraps a minimal Kubernetes cluster, meeting conformance
    standards, and automating many cluster operations through its toolchain.

-   [Lokomotive](https://github.com/kinvolk/lokomotive-kubernetes): an open
    source project by [Kinvolk](https://kinvolk.io/) which distributes pure
    upstream Kubernetes.

-   [Rancher Kubernetes Engine (RKE)](https://rancher.com/docs/rke/latest/en/):
    RKE solves the problem of installation complexity, a common issue in the
    Kubernetes community. With RKE, the installation and operation of Kubernetes
    is both simplified and easily automated, and it’s entirely independent of
    the operating system and platform you’re running.

-   [Crossplane](https://crossplane.io/): Manage cluster deployments across
    cloud providers.

-   [K3s](https://k3s.io/): Lightweight certified Kubernetes distribution for
    IoT & Edge computing.

-   [Kubespray](https://kubespray.io/): runs perfectly on Packet, using Ansible
    as its substrate for provisioning and orchestration. Kops performs the
    provisioning and orchestration itself, and as such is less flexible in
    deployment platforms.

-   [Pharmer](https://pharmer.io/): a technical preview from Appscode of a
    Kubernetes cluster manager for kubeadm. Pharmer lets you set up, tear down,
    and scale clusters up and down on Packet.

-   [Kubernetes on
    DC/OS](https://github.com/mesosphere/dcos-kubernetes-quickstart): A package
    to deploy Kubernetes cluster in your
    [DC/OS](https://github.com/mesosphere/dcos-kubernetes-quickstart)
    environment.

#### **Commercial Deployment Solutions**

-   [Platform9](https://platform9.com/): Packet works closely with Platform9, a
    managed cloud provider, to enable users with Kubernetes, Openstack, and
    Serverless solutions.

-   [Cloud66](https://www.cloud66.com/): London-based Cloud66 offers a managed
    Kubernetes container service called Maestro, which is tested against Packet.

-   [RedHat OpenShift](https://www.openshift.com/): OpenShift is an open source
    container application platform by Red Hat based on the Kubernetes container
    orchestrator for enterprise app development and deployment.

#### **Community**

Packet is actively involved in supporting the Kubernetes cloud native space.

-   [CNCF Community Infrastructure
    Lab](https://www.cncf.io/community/infrastructure-lab/): Packet donates
    \$25,000 per month in compute resources that are available to the CNCF and
    broader open source community.

-   [CNCF Cross Cloud CI](https://cncf.ci/) - Packet is represented as the only
    bare metal cloud on this unique dashboard, which shows the results of a
    sample implementation of the CNCF project stack against various providers.

**Common Questions**
--------------------

### Can I Use Packet With My Kubernetes Stack?

Packet has been validated to work with many Kubernetes distributions, service
providers and tools. For Kubernetes to work in a particular deployment scenario,
you need to answer two questions:

1.  Will my stack work *on* Packet?

2.  Will my stack be *with* Packet?

The vast majority of distributions of Kubernetes work on Packet as is,
including, of course, the official upstream Kubernetes from
[kubernetes.io](https://kubernetes.io/) and most certified distributions.

Packet itself has released official core Kubernetes integrations that enable
certified standard Kubernetes distributions to work with Packet as a cloud
provider.

### Does Packet Have a Managed Kubernetes Service?

No. Packet does not have a managed Kubernetes service. We consciously chose not
to create one, to help keep our partner ecosystem thriving, and provide you, the
customer, with the maximum choice in how you want to run Kubernetes.

For more information, see our CEO's blog post, [Oops, We Forgot to Build a
Managed Kubernetes
Service](https://www.packet.com/blog/oops-we-forgot-to-build-a-managed-kubernetes-service/).

### Is Kubernetes on Packet Mature and Up To Date?

Yes, it most certainly is. On one front, we work closely with our partners and
software providers to ensure the latest versions of Kubernetes and management
providers software work well both *on* and *with* Packet. On the other front, we
maintain our own set of core, low-level integrations that conform to the
Kubernetes API and enable every certified Kubernetes integration work *with*
Packet as a cloud provider.

### Can I use Deployers?

Yes, you can. We have deployed integration with partners like
[Rancher](https://rancher.com/) and [Weave](https://weave.works/), we have
released and continue to maintain integrations with deployment software like
[kubespray](https://github.com/kubernetes-sigs/kubespray) and
[Gardener](https://gardener.cloud/), and we have released and maintain the
official Kubernetes standard for cloud provider management,
[cluster-api](https://github.com/kubernetes-sigs/cluster-api), which both stands
on its own and is being integrated directly into more and more deployment
providers.
