<!-- <meta>
{
    "title":"Tooling",
    "slug":"tooling",
    "description":"Kubernetes Tooling",
    "author":"Alice Sowerby",
    "github":"alice-sowerby",
    "tag":["Integrations", "K8s"]
}
</meta> -->


Packet's Kubernetes ecosystem is very diverse and flexible. It works with a wide variety of open source and enterprise solutions.

Community Open Source
-----------

As the Kubernetes ecosystem matures, it has adopted formal specifications to
help ensure a consistent experience across infrastructure providers and third-party solutions. We support, create, and contribute to various open-source
projects and integrations to give you more control over Kubernetes on Packet.


##### Core Kubernetes


| **Name**                               | **Description**                                                                                                                                                                                                 | **Link**                                                                                                                                                                   |
|----------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Upstream Kubernetes](https://github.com/kubernetes/kubernetes)                | The official open-source project owned by the CNCF. |
| [Cluster Autoscaler for Packet](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler/cloudprovider/packet)      | Autoscaling for worker node groups in your Kubernetes clusters.                     |
| [Packet Cloud Controller Manager](https://github.com/packethost/packet-ccm)    | Allows clusters to interface and authenticate with Packet's APIs.  |
| [Packet Cluster API provider](https://github.com/kubernetes-sigs/cluster-api-provider-packet)        | The Cluster API is a Kubernetes project to bring declarative, Kubernetes-style APIs to cluster creation, configuration, and management. It provides optional, additive functionality on top of core Kubernetes. | 
| [Packet Container Storage Interface](https://github.com/packethost/csi-packet) | Create Persistent Volumes for Kubernetes from Packet's block storage offering using the [CSI](https://kubernetes.io/blog/2019/01/15/container-storage-interface-ga/) standard. |


##### 3rd-Party 


| **Name**                            | **Description**                                                                                                                                                                                                                                                                  | **Link**                                                                                                                                 |
|-------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| [Calico](https://docs.projectcalico.org/introduction/)                         | Networking and network security solution.                                                                                                                                                                                                                                        | [GitHub](https://github.com/projectcalico/calico)                        |
| [Crossplane](https://crossplane.io/)                      | Manage cluster deployments across cloud providers.                                                                                                                                                                                                                               |                                                                                                  |
| [Gardener](https://gardener.cloud/)                        | SAP’s Kubernetes Control Plane Manager.                                                                                                                                                                                                                                           | [GitHub](https://github.com/gardener/gardener)                                                 |
| [K3s](https://k3s.io/)                             | Lightweight certified Kubernetes distribution made by Rancher for IoT & Edge computing.                                                                                                                                                                                          | [GitHub](https://github.com/rancher/k3s)                                                               |
| [Kubeadm](https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm/)                         | kubeadm bootstraps a minimal Kubernetes cluster, meeting conformance standards, and automating many cluster operations through its toolchain.                                                                                                                                    | [GitHub](https://github.com/kubernetes/kubeadm) |
| [Kubespray](https://kubespray.io/)                       | Runs perfectly on Packet, using Ansible as its substrate for provisioning and orchestration. kops performs the provisioning and orchestration itself, and as such is less flexible in deployment platforms.                                                                      | [GitHub](https://github.com/kubernetes-sigs/kubespray)                                      |
| [GitHub](https://github.com/kinvolk/lokomotive-kubernetes)              |
| [MetalLB](https://metallb.universe.tf/)                            | A load-balancer implementation for bare metal Kubernetes clusters, using standard routing protocols.                                                                                                            | [GitHub](https://github.com/metallb/metallb)                                                                       |

Commercial Open Source
---------

There are a host of excellent commercial services which are built on an
open-source base giving peace of mind.

| **Service**                                                                                  | **Description**                                                                                                                      |
|----------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------|
| [Cloud66](https://www.cloud66.com/)                                                          | London-based Cloud66 offers a managed Kubernetes container service called Maestro, which is tested against Packet.                   |
| [Kubermatic](https://www.kubermatic.com/company/about-us/)                                   | Automated multi cloud Kubernetes and related services.                                                                               |
| [Lokomotive](https://kinvolk.io/lokomotive-kubernetes/)                      | An open-source project by Kinvolk which distributes pure upstream Kubernetes.                                                                                                                                                                                                   
| [Platform9](https://platform9.com/)                                                          | Packet works closely with Platform9, a managed cloud provider, to enable users with Kubernetes, Openstack, and Serverless solutions. |
| [Rancher](https://rancher.com/)                                                              | Managed Kubernetes as a service for on-prem or hybrid clusters.                                                                      |
| [Weave Kubernetes Platform](https://www.weave.works/product/enterprise-kubernetes-platform/) | Managed Kubernetes service with GitOps in the cloud or on prem.                                                                      |

Enterprise Solutions
----------

For enterprise-level support and services these are your first port of call.

| **Service**                                       | **Description**                                                                                                                                                     |
|---------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Google Anthos](https://cloud.google.com/anthos/) | Manage Kubernetes workloads across on-prem and public cloud environments.                                                                                           |
| [Red Hat OpenShift](https://www.openshift.com/)    | OpenShift is an open source container application platform by Red Hat based on the Kubernetes container orchestrator for enterprise app development and deployment. |
| [VMware Tanzu](https://tanzu.vmware.com/tanzu)  | Use VMware’s ESXi platform to enable cloud native deployments across on-prem and public cloud compute.                                                              |

