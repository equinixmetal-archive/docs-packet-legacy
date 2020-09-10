<!-- <meta>
{
    "title":"Simple K8s Cluster on Packet",
    "description":"Kubernetes helps you make sure those containerized applications run where and when you want, and helps them find the resources and tools they need to work.",
    "tag":["Kubernetes"],
    "seo-title": "Simple K8s Cluster - Packet Technical Guides",
    "seo-description": "Simple K8s Cluster on Packet",
    "og-title": "Explore Kubernetes Clusters on Packet.",
    "og-description":"Kubernetes can be deployed in a number of ways on Packet, but find out how to utilize Kubernetes on bare metal in a more upstream format.",
    "featured": true
}
</meta> -->

Kubernetes is an open-source container orchestration framework which was built upon the learnings of Google. It enables you to run applications using containers in a production ready-cluster.

Kubernetes can be installed in a number of ways on Packet however, in this guide we will be utilizing Kubernetes in a pure upstream format.

#### Getting Started

OS & Hardware selection is dependent upon your particular build requirements. For this guide, we made use of three (3) of our [c1.small](https://www.packet.com/cloud/servers/c1-small/) on-demand devices along with Ubuntu 20.04.


> **Note:** For each device that will be in your Kubernetes the following will need to be done:

### Upgrade and Update OS Packages


````
sudo apt update && sudo apt upgrade -y
````

### Installing Docker


````
sudo apt install docker.io
````
Enable Docker: 
````
sudo systemctl enable --now docker
````

### Installing Kubernetes

````
apt-get update && apt-get install -y \
  apt-transport-https ca-certificates curl software-properties-common gnupg2 
````

````
sudo curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
````

```
echo "deb http://apt.kubernetes.io/ kubernetes-xenial main" \
  | sudo tee -a /etc/apt/sources.list.d/kubernetes.list \
  && sudo apt-get update 
````
> **Note:** At the time of this writing, Ubuntu 16.04 Xenial Xerus is the latest Kubernetes repository available. This should eventually be superseded by Ubuntu 20.04 Focal Fossa, and the following command can then be updated from `xenial` to `focal`.


To proceed the following three packages are required: `kubelet`, `kubeadm` and `kubernetes-cni`. 

````
sudo apt-get update \
  && sudo apt-get install -yq \
  kubelet \
  kubeadm \
  kubernetes-cni
````
It is suggested to place the Kubernetes package on hold. As, when you update your system it could cause an unexpected bump in the current version.

```
sudo apt-mark hold kubelet kubeadm kubectl
```

### Disable Swap

It has been advised by Kubernetes maintainers that the use of swap memory leads to unpredictable behavior as such, it's suggested to disable swap prior to deploying your cluster.

To disable, review `/etc/fstab` and comment out the following line: 

```
UUID=c170834e-e51c-4812-82ac-a4d53ddc5d34       none    swap    none    0       0
```

Then issue: 
````
swapoff UUID=2ac483ff-62b4-42b6-80aa-41b58f8a5ceb
````
UUID would be the one pertaining to your SWAP partition from the `/etc/fstab` file.

#### Network

For the purpose of this guide, we will expose K8s through the private network functionality. 

```
ifconfig bond0:0
bond0:0: flags=5187<UP,BROADCAST,RUNNING,MASTER,MULTICAST>  mtu 1500
inet 10.88.82.133  netmask 255.255.255.254  broadcast 255.255.255.255
ether ac:1f:6b:99:ba:ac  txqueuelen 1000  (Ethernet)
```

##### Initialize your cluster

````
sudo kubeadm init --apiserver-advertise-address=10.80.0.133
````
> **Note:** Only run this step on your designated master node.



If all goes well, you'll be presented with a success message, similar to: 

```
Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join 10.88.82.129:6443 --token fe82ft.kk1mwznb0hchxbvn \
    --discovery-token-ca-cert-hash sha256:fa7b9b807941c1664ac68cc3e129211d4462f7f402b89acc6c4527ed86e460be
````

#### Create a Wheel User

Devices on Packet do not include an unprivileged user. To proceed, one must be created. 

````
sudo useradd username -G sudo -m -s /bin/bash
````
Set the username password:
````
sudo passwd username 
````

### Setting up environmental variables

Switch to the user that you created in the last step to setup `KUBECONFIG` you can do that by issuing `sudo su username` and issue the following: 

````
cd $HOME
sudo cp /etc/kubernetes/admin.conf $HOME/
sudo chown $(id -u):$(id -g) $HOME/admin.conf
````
````
echo "export KUBECONFIG=$HOME/admin.conf" | tee -a ~/.bashrc
````
````
source ~/.bashrc
````

Try the `kubectl` command to see if master node is listed. It will, for now, appear to be in a `NotReady` status. 

````
$ kubectl get node
NAME     STATUS     ROLES    AGE   VERSION
k8s-02   NotReady   master   23m   v1.18.2
````


### Installing Network Plugin

Applying configuration to the cluster using `kubectl` and our new `kubeconfig` will enable networking and the master node will be in `Ready` status. 

````
sudo mkdir -p /var/lib/weave
````
````
head -c 16 /dev/urandom | shasum -a 256 | cut -d" " -f1 | sudo tee /var/lib/weave/weave-passwd
````
````
kubectl create secret -n kube-system generic weave-passwd --from-file=/var/lib/weave/weave-passwd
````

In this example, since the default private network is already used on the hosts (10.0.0.0/8), use 192.168.0.0/16 for Weave configuration:

````
kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')&env.IPALLOC_RANGE=192.168.0.0/16"
````

Reference: https://www.weave.works/docs/net/latest/kubernetes/kube-addon/#configuration-options

> **Note:** You would need to use a different private subnet for Weave net to avoid conflicts.

#### Add the nodes

On the master node you ran `kubeadm init`, the result was a token that is valid for 24-hours. You'll use that, to join your two other nodes. 

````
kubeadm join 10.88.82.129:6443 --token fe82ft.kk1mwznb0hchxbvn \
    --discovery-token-ca-cert-hash sha256:fa7b9b807941c1664ac68cc3e129211d4462f7f402b89acc6c4527ed86e460be
````

If the above results in an error, backtrack the steps as one may have been inadvertently omitted. 

Move back to the master node, you should then see all sitting in the `Ready` status. 

````
kubectl get node
NAME     STATUS   ROLES    AGE     VERSION
k8s-01   Ready    <none>   4m28s   v1.18.2
k8s-02   Ready    master   3h23m   v1.18.2
k8s-03   Ready    <none>   23m     v1.18.2
````

Check the health of the cluster: 

````
kubectl get all --all-namespaces
````
````
NAMESPACE     NAME                                 READY   STATUS    RESTARTS   AGE
kube-system   pod/coredns-66bff467f8-cr7w5         1/1     Running   0          3h25m
kube-system   pod/coredns-66bff467f8-hrhjr         1/1     Running   0          3h25m
kube-system   pod/etcd-k8s-02                      1/1     Running   0          3h25m
kube-system   pod/kube-apiserver-k8s-02            1/1     Running   0          3h25m
kube-system   pod/kube-controller-manager-k8s-02   1/1     Running   0          3h25m
kube-system   pod/kube-proxy-8nndw                 1/1     Running   0          3h25m
kube-system   pod/kube-proxy-jtlnm                 1/1     Running   0          6m14s
kube-system   pod/kube-proxy-vfwzh                 1/1     Running   0          25m
kube-system   pod/kube-scheduler-k8s-02            1/1     Running   0          3h25m
kube-system   pod/weave-net-8btjw                  2/2     Running   0          25m
kube-system   pod/weave-net-qc79h                  2/2     Running   0          35m
kube-system   pod/weave-net-zb778                  2/2     Running   0          6m14s

NAMESPACE     NAME                 TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)                  AGE
default       service/kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP                  3h25m
kube-system   service/kube-dns     ClusterIP   10.96.0.10   <none>        53/UDP,53/TCP,9153/TCP   3h25m

NAMESPACE     NAME                        DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR            AGE
kube-system   daemonset.apps/kube-proxy   3         3         3       3            3           kubernetes.io/os=linux   3h25m
kube-system   daemonset.apps/weave-net    3         3         3       3            3           <none>                   35m

NAMESPACE     NAME                      READY   UP-TO-DATE   AVAILABLE   AGE
kube-system   deployment.apps/coredns   2/2     2            2           3h25m

NAMESPACE     NAME                                 DESIRED   CURRENT   READY   AGE
kube-system   replicaset.apps/coredns-66bff467f8   2         2         2       3h25m
````

The above shows the cluster is healthy and you can now deploy your microservice therein! 
