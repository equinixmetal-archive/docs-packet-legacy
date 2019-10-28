<!--
<meta>
{
    "title":"Kubernetes Cluster Autoscaler",
    "description":"Kubernetes Cluster Autoscaler on Packet",
    "author":"Enkel",
    "github":"enkelprifti98",
    "date": "2019/9/19",
    "email":"enkel@packet.com",
    "tag":["Kubernetes", "Cluster", "Autoscaler"]
}
</meta>
-->

# Kubernetes Cluster Autoscaler on Packet

## Introduction

If you are deploying your applications with Kubernetes or are just diving into the platform, you have probably run into the issue of pods or containers not being scheduled due to unavailable resources. Kubernetes has a Vertical pod autoscaler which allows you to configure how many resources such as CPU, RAM, etc you want allocate to your pods as well as a Horizontal pod autoscaler which dynamically adjusts pod replicas based on metrics such as CPU utilization, though the metrics can be customized. There can be times where the pod autoscalers can’t allocate more resources or create more pod replicas due to unavailable node resources.

The Kubernetes Cluster Autoscaler is designed to dynamically scale your cluster nodepools based on unschedulable pods or nodes that aren’t needed anymore. While this has been supported on cloud providers that use VMs, Packet is the first public cloud provider to support the Cluster Autoscaler on Baremetal servers. In this guide, we’ll be configuring the cluster autoscaler on a bare metal cluster that you have already deployed. If you’re looking for a script that quickly deploys a cluster with a master and two worker nodes, we have a great [demo](https://github.com/packet-labs/kubernetes-bgp) at the Packet-Labs github repo. The following is the example cluster with 1 master and 2 workers that we’ll be using for this guide:

![alt text](/images/kubernetes-cluster-autoscaler-on-packet/k8s-cluster-overview.png)

## Configuration

Notes: At this point, the cluster autoscaler does not support multiple nodepools. The autoscaler will not remove nodes which have non-default kube-system pods. This prevents the node that the autoscaler is running on from being scaled down. If you are deploying the autoscaler into a cluster which already has more than one node, it is best to deploy it onto any node which already has non-default kube-system pods, to minimise the number of nodes which cannot be removed when scaling.

The autoscaler will run as a `Deployment` in your cluster and the nodepool is specified using tags on Packet.

First, you’ll need to download the necessary files in the [examples folder](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler/cloudprovider/packet/examples) . You can do this by cloning the autoscaler repository and copying the examples folder to your preferred location and then delete the autoscaler folder.

### ServiceAccount Deployment

The cluster autoscaler needs a `ServiceAccount` with permissions for Kubernetes and requires credentials for interacting with Packet. An example ServiceAccount is given in [examples/cluster-autoscaler-svcaccount.yaml](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/cloudprovider/packet/examples/cluster-autoscaler-svcaccount.yaml) . You don’t need to edit anything to the sample file and can simply deploy the ServiceAccount with the following command:

`kubectl apply -f cluster-autoscaler-svcaccount.yaml`


### Secret Deployment

The credentials for authenticating with Packet are stored in a `secret` and provided as an environment variable to the autoscaler container. An example secret file is given in [examples/cluster-autoscaler-secret.yaml](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/cloudprovider/packet/examples/cluster-autoscaler-secret.yaml) .  In this file you’ll need to modify the following fields:

| Secret                          | Key                     | Value                        |
|---------------------------------|-------------------------|------------------------------------------------------------------------------------------------------------------------------------|
| cluster-autoscaler-packet       | authtoken               | Your Packet API token. It must be base64 encoded.                                                                                 |
| cluster-autoscaler-cloud-config | Global/project-id       | Your Packet project ID.                                                                                                             |
| cluster-autoscaler-cloud-config | Global/api-server       | The ip:port for you cluster’s k8s api (e.g. K8S_MASTER_PUBLIC_IP:6443) found in the kubeadm-config.yaml file.                                                            |
| cluster-autoscaler-cloud-config | Global/facility         | The Packet facility for the devices in your nodepool (eg: AMS1).                                                                    |
| cluster-autoscaler-cloud-config | Global/plan             | The Packet plan (aka size/flavor) for new nodes in the nodepool (eg: t1.small.x86).                                                 |
| cluster-autoscaler-cloud-config | Global/billing          | The billing interval for new nodes (default: hourly).                                                                               |
| cluster-autoscaler-cloud-config | Global/os               | The OS image to use for new nodes (default: ubuntu_18_04). If you change this also update cloudinit.                               |
| cluster-autoscaler-cloud-config | Global/cloudinit        | The base64 encoded [user data](https://support.packet.com/kb/articles/user-data) submitted when provisioning devices. In the example file, the default value has been tested with Ubuntu 18.04 to install Docker & kubelet and then to bootstrap the node into the cluster using kubeadm. For a different base OS or bootstrap method, this needs to be customized accordingly.  |
| cluster-autoscaler-cloud-config | Global/reservation      | The values “require” or “prefer” will request the next available hardware reservation for new devices in selected facility & plan. If no hardware reservations match, “require” will trigger a failure, while “prefer” will launch on-demand devices instead (default: none).  |
| cluster-autoscaler-cloud-config | Global/hostname-pattern | The pattern for the names of new Packet devices (default: “k8s-{{.ClusterName}}-{{.NodeGroup}}-{{.RandString8}}” ).                  
| bootstrap-token-cluster-autoscaler-packet  | token-id   | You cluster token-id. If you don’t have a token setup, you can refer to the official K8s [guide](https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm-token/). 
| bootstrap-token-cluster-autoscaler-packet.  | token-secret  | You cluster token secret.  |


Once you’ve configured the secret file accordingly, you can deploy the secret as follows:

`kubectl apply -f cluster-autoscaler-secret.yaml`

### Autoscaler Deployment

Next we’ll need to setup the nodepool and cluster names by using Packet tags. The Packet API does not yet have native support for groups or pools of devices, so we use tags to specify them. Each Packet device that is a member of the “cluster1” cluster should have the tag “k8s-cluster-cluster1”. The devices that are members of the “pool1” nodepool should also have the tag “k8s-nodepool-pool1”. Once you have a Kubernetes cluster running on Packet, use the Packet Portal or API to tag the nodes accordingly. The master node should have the cluster1 tag but not the pool1 tag as that is only needed for the worker nodepool that will be autoscaled. You can also simply have a master node without any worker nodes and the autoscaler will deploy new workers as needed. The tags should looks like the following images:

Master tags:
![alt text](/images/kubernetes-cluster-autoscaler-on-packet/master-tags.png)


Worker tags:
![alt text](/images/kubernetes-cluster-autoscaler-on-packet/worker-tags.png)


Once you have setup the nodepool with the appropriate Packet tags, we can now configure the autoscaler deployment. An example Deployment is given in [examples/cluster-autoscaler-deployment.yaml](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/cloudprovider/packet/examples/cluster-autoscaler-deployment.yaml).yaml but you’ll need to adjust the following arguments:

| Argument         | Usage                                                                                                      |
|------------------|------------------------------------------------------------------------------------------------------------|
| --cluster-name   | The name of your Kubernetes cluster. It should correspond to the tags that have been applied to the nodes. In this demo, it would be “cluster1”. |
| --nodes          | Of the form `min:max:NodepoolName`. Only a single node pool is currently supported. NodepoolName would be “pool1” for this demo.                        |


Now you can deploy the autoscaler with the following command:

`kubectl apply -f cluster-autoscaler-deployment.yaml`


You’ll notice that the autoscaler pod is now created by looking at the pods under the kube-system namespace:

`kubectl get pods --namespace=kube-system`

You can also view live logs of the autoscaler container with the following command:

`kubectl logs <container-name> --namespace=kube-system`


To see the autoscaler in action, you can scale your deployment up and down and the autoscaler will create or remove nodes when needed.

**Note**: It’s recommended to pair the autoscaler with the [Packet CCM](/guides/kubernetes-ccm-for-packet.md) (Cloud Controller Manager) for Kubernetes as that takes care of the logical node objects being removed from the cluster. We have a guide on how to deploy the CCM to your cluster here.

Congratulations! You have now setup the Kubernetes Cluster Autoscaler on your bare metal cluster on Packet.






