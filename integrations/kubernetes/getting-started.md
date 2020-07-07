<!-- <meta>
{
    "title":"Introduction",
    "slug":"official kubernetes",
    "description":"Our Kubernetes Offerings",
    "author":"Alice Sowerby",
    "github":"alice-sowerby",
    "tag":["Integrations", "K8s"]
}
</meta> -->

# Introduction

## What Is Kubernetes?

[Kubernetes](https://kubernetes.io/) is the modern standard for:



*   Describing how containerized applications should be deployed and run.
*   Orchestrating or managing the described deployments.

Kubernetes is a tool that enables operators to describe and deploy containerized applications to run across clusters of machines. Combined with practices such as GitOps, Continuous Deployment and Continuous Integration this helps teams to reduce release cycle times, streamline infrastructure, and increase the resilience of their applications.

Kubernetes ensures that your applications are always either in the described state or converging to that state.


## Kubernetes Our Way

Instead of building a managed Kubernetes service, we focus on building a first-class K8s experience by investing in core open-source components and plugins - from cluster creation to autoscaling.

Find out more about our thinking here:



*   [Oops, We Forget to Build a Managed Kubernetes Service](https://www.packet.com/blog/oops-we-forgot-to-build-a-managed-kubernetes-service/)
*   [Why We Can’t Wait for AWS to Announce Bare Metal](https://www.packet.com/blog/why-we-cant-wait-for-aws-to-announce-its-bare-metal-product/)
*   [Multicloud and Kubernetes](https://www.packet.com/resources/videos/multicloud-kubernetes/)

Kubernetes is a natural fit for Packet. With all of the power and control available to you with a bare-metal cloud, Kubernetes is the control plane that enables you to deploy your applications in a uniform cloud-native way, taking advantage of both the power of bare metal and the flexibility and control of cloud-native.


## Our Kubernetes Ecosystem


### CNCF

We’ve been supporting the CNCF since 2015. We’re proud to be an active part of many projects, including:



*   [CNCF Community Infrastructure Lab](https://www.cncf.io/community/infrastructure-lab/): Packet donates $100k's per month in compute resources that are available to the CNCF and broader open source community.
*   [CNCF Cross Cloud CI](https://cncf.ci/) - Packet is represented as the only bare metal cloud on this unique dashboard, which shows the results of a sample implementation of the CNCF project stack against various providers.
*   [Cloud Native Network Functions Test Bed](https://www.cncf.io/announcement/2019/02/25/cncf-launches-cloud-native-network-functions-cnf-testbed/): Packet supports the building and testing of cloud native network functions, in their shift from appliances, to virtual machines, to containers.


#### 3rd-Party Distributions

There are several certified Kubernetes distributions that either simplify the deployment of Kubernetes, or tailor it to a specific need. Many of them have been verified to work both on and with Packet, and ease your path to deployment.

#### Deployers

In addition, several Kubernetes deployment software systems can deploy and manage Kubernetes for you, as well as the official [cluster-api for Packet](http://github.com/packethost/cluster-api-provider-packet). Additionally, some software will do both, providing a distribution and deployment control. 

#### Managed Services

For the most hands-off approach, a number of providers offer managed Kubernetes services, including, in some cases, multi-cloud. With these services, you sign up, click a few buttons, and they manage your clusters and infrastructure from a single pane of glass.

[Check out our full list of partners](https://www.packet.com/resources/partners/).


## FAQs

#### Is Kubernetes Different On Bare Metal Than On Virtual Machines?

Kubernetes on bare metal does not operate any differently than on virtual machines... provided you have a cloud provider interface to manage the bare metal. Kubernetes relies on interacting with your cloud provider to check the state of your servers, deploy or remove load balancers and do other important management tasks. You can run Kubernetes on bare metal for significant benefits including performance, security and control. However, you will lose much of the Kubernetes management benefits unless you have a cloud provider interface to let Kubernetes work with your bare metal.

Packet provides precisely that cloud provider interface together with bare metal to make the best Kubernetes experience possible.

#### Is Kubernetes Better On Bare Metal Than On Virtual Machines?

We think so, yes! Only with bare metal can you get the best benefits of Kubernetes.



*   Your pods have access to dedicated processing and memory power, getting all of the resources they really expect; none of the "virtual cpu" or "e-cpu" or "cpu-equivalents".
*   Your pods can have direct access to all of the unique hardware, such as network cards, GPUs, TPUs, blockchain processors and any other special hardware you deploy.
*   Your clusters have 100% security isolation, providing compliance with the tightest of security standards.
*   Your pods have no "noisy neighbour" issues, competing either for the processors or the network.
*   The clock time provided to your pods have metal-level accuracy, without any of the issues that exist in virtual machines.
