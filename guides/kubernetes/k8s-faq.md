<!-- <meta>
{
    "title":"Kubernetes FAQ",
    "description":"Kubernetes helps you make sure those containerized applications run where and when you want, and helps them find the resources and tools they need to work.",
    "tag":["Kubernetes"],
    "seo-title": "Kubernetes FAQ - Packet Technical Guides",
    "seo-description": "Kubernetes FAQ",
    "og-title": "Kubernetes FAQ",
    "og-description":"Kubernetes FAQ",
    "featured": true
}
</meta> -->

# Kubernetes on Packet FAQ

* [What is Kubernetes?](#what-is-kubernetes)
* [What is Kubernetes on Packet?](#what-is-kubernetes-on-packet)
* [Is Kubernetes on bare metal different than on VMs?](#is-kubernetes-on-bare-metal-different-than-on-vms)
* [Is Kubernetes on bare metal better than on VMs?](#is-kubernetes-on-bare-metal-better-than-on-vms)
* [Why should I use Kubernetes on Packet?](#why-should-i-use-kubernetes-on-packet)
* [Can I use Packet with my Kubernetes stack?](#can-i-use-packet-with-my-kubernetes-stack)
* [Does Packet have a managed Kubernetes service?](#does-packet-have-a-managed-kubernetes-service)
* [Is Kubernetes on Packet mature and up-to-date?](#is-kubernetes-on-packet-mature-and-up-to-date)
* [Can I use deployers like Rancher, Kubespray or Gardener?](#can-i-use-deployers)
* [What are my options for Kubernetes on Packet?](#what-are-my-options-for-kubernetes-on-packet)

## What Is Kubernetes?

[Kubernetes](https://kubernetes.io) is the modern standard for:

* describing how applications should be deployed and run
* orchestrating or managing the described deployments

Kubernetes ensures that your applications are always either in the described state or converging to that state.

## What is Kubernetes on Packet?

Kubernetes is a natural fit for Packet. With all of the power and control available to you with a bare-metal cloud, Kubernetes is the control
plane that enables you to deploy your applications in a standard cloud-native way, taking advantage of both the power of bare-metal and the
flexibility and control of cloud-native.

## Is Kubernetes Different on Bare Metal than on VMs?

Kubernetes on bare metal does not operate any differently than on VMs... provided you have a cloud provider interface to manage the bare metal.
Kubernetes relies on interacting with your cloud provider to check the state of your servers, deploy or remove load balancers and do other
important management tasks. You _can_ run Kubernetes on bare metal for significant benefits; see the next section. But you will lose much of the
Kubernetes management benefits unless you have a cloud provider interface to let Kubernetes work with your bare metal.

Packet provides precisely that cloud provider interface together with bare metal to make the best Kubernetes experience possible.

## Is Kubernetes Better on Bare Metal than on VMs?

Yes. Only with bare metal can you get the best benefits of Kubernetes.

* Your pods have access to dedicated processing and memory power, getting all of the resources they really expect; none of the "virtual cpu" or "e-cpu" or "cpu-equivalents"
* Your pods can have direct access to all of the unique hardware, such as network cards, GPUs, TPUs, blockchain processors and any other special hardware you deploy 
* Your clusters have 100% security isolation, providing compliance with the tightest of security standards
* Your pods have no "noisy neighbour" issues, competing either for the processors or the network
* The clock time provided to your pods have metal-level accuracy, without any of the issues that exist in VMs

## Why Should I Use Kubernetes on Packet?

Only Packet gives you the best of all worlds:

* All of the benefits of bare metal
* All of the benefits of Kubernetes
* All of the benefits of a cloud-provider to marry the two

## Can I Use Packet With My Kubernetes Stack?

Packet has been validated to work with many Kubernetes distributions, service providers and tools.
For Kubernetes to work in a particular deployment scenario, you need to answer two questions:

1. Will my stack work _on_ Packet?
1. Will my stack with _with_ Packet?

The vast majority of distributions of Kubernetes work on Packet as is, including, of course, the official upstream Kubernetes from [kubernetes.io](https://kubernetes.io) and most certified distributions.

Packet itself has released official core Kubernetes integrations that enable certified standard Kubernetes distributions to work with Packet as a cloud provider.

[NOTE: Add LIST]

## Does Packet Have a Managed Kubernetes Service?

No. Packet does not have a managed Kubernetes service. We consciously chose not to create one, to help keep our partner ecosystem
thriving, and provide you, the customer, with the maximum choice in how you want to run Kubernetes.

For more information, see our CEO's blog post, [Oops, We Forgot to Build a Managed Kubernetes Service](https://www.packet.com/blog/oops-we-forgot-to-build-a-managed-kubernetes-service/).

## Is Kubernetes on Packet Mature and Up-To-Date?

Yes, it most certainly is. On one front, we work closely with our partners and software providers to ensure the latest versions of Kubernetes and management
providers software work well both _on_ and _with_ Packet. On the other front, we maintain our own set of core, low-level integrations that conform to the
Kubernetes API and enable every certified Kubernetes integration work _with_ Packet as a cloud provider.

## Can I use Deployers?

Yes, you can. We have deployed integration with partners like [Rancher](https://rancher.com) and [Weave](https://weave.works), we have released and continue
to maintain integrations with deployment software like [kubespray](https://github.com/kubernetes-sigs/kubespray) and [Gardener](https://gardener.cloud),
and we have released and maintain the official Kubernetes standard for cloud provider management, [cluster-api](https://github.com/kubernetes-sigs/cluster-api),
which both stands on its own and is being integrated directly into more and more deployment providers.

## What Are My Options for Kubernetes on Packet?

You have three high-level options.

### Pure Upstream Kubernetes

If you want, you can download [the official pure upstream Kubernetes](https://kubernetes.io/docs/setup/), install the Packet integrations, and work with it directly.
You also can use any of the official installers or deployment tools, including kubeadm and kubespray.

The official Kubernetes distribution works cleanly on Packet, and the Packet integrations provide a seamless experience for working with Packet as a cloud
provider.

### Certified Distributions and Deployers

There are several certified Kubernetes distributions that either simplify the deployment of Kubernetes, or tailor it to a specific need. Many of them have
been verified to work both _on_ and _with_ Packet, and ease your path to deployment.

In addition, several Kubernetes deployment software systems, such as [Rancher](https://rancher.com) and [Gardener](https://gardener.cloud) can deploy and
manage Kubernetes for you, as well as the official [cluster-api for Packet](http://github.com/packethost/cluster-api-provider-packet).

Finally, some software will do _both_, providing a distribution and deployment control.

### Managed Kubernetes Services

For the most hands-off approach, a number of providers offer managed Kubernetes services, including, in some cases, multi-cloud. With these services, you
sign up, click a few buttons, and they manage your clusters and infrastructure from a single pane of glass.