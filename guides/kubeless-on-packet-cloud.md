<!--<meta>
{
    "title":"Kubeless on Packet",
    "description":"Setup Kubeless on a bare metal K8s cluster",
    "author":"Edo",
    "github":"ariaedo",
    "date": "2019/06/06",
    "email":"ronggur.mh@gmail.com",
    "tag":["kubeless", "another tag"]
}
</meta>-->

_This post was originally posted by Bitnami's Sameer Naik on [Medium.com](https://medium.com/bitnami-perspectives/kubeless-on-packet-cloud-9e5605b8bb97)._

In this post we’ll walk thought setting up [Kubeless](http://kubeless.io/) on a [Kubernetes](https://kubernetes.io/docs/concepts/overview/what-is-kubernetes/) cluster running on Packet bare metal cloud. Kubeless is a Kubernetes-native serverless framework that lets you deploy small bits of code (functions) without having to worry about the underlying infrastructure.

Kubernetes is the premier orchestration platform for managing containerized applications across multiple hosts. Originally developed at Google, the project has been contributed the Cloud Native Computing Foundation ([CNCF](https://www.cncf.io/about)).

Packet is a bare metal cloud platform built for developers. The platform brings the promise of the virtualized cloud to bare metal with premium Intel and ARMv8 based server configurations.

Setting up a Kubernetes cluster
-------------------------------

In this section we will quickly go over the creation of a Kubernetes cluster on Packet cloud. Once you’ve logged in add your personal SSH key under the **SSH Keys** section.

Set up the master node
----------------------

From the Packet cloud create a new project named `Kubernetes` and deploy a new server named `kube-master`. As the name suggests, this we’ll configure this as the master node of the Kubernetes cluster.

Log into the `kube-master` server using SSH and execute the following command sequence to install the required components to the server.

    $ apt-get update && apt-get install -y apt-transport-https
    $ curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
    $ echo "deb http://apt.kubernetes.io/ kubernetes-xenial main" >> /etc/apt/sources.list.d/kubernetes.list
    $ apt-get update && apt-get install -y docker.io kubelet kubeadm kubectl kubernetes-cni
    $ swapoff -a && apt-get install linux-image-$(uname -r)

Next, use `kubeadm` to initialize the server as the master node.

    $ kubeadm init --pod-network-cidr=10.244.0.0/16 --apiserver-advertise-address=$(ip address show label bond0:0 | sed -n 's/[ ]*inet \([^\/]*\).*/\1/p') --kubernetes-version stable-1.8

The `kubeadm init` command execution will display the `kubeadm join` command that should be used to join nodes to the cluster. Please make a note of this command before continuing.

Next, create a regular user named `packet`.

    $ useradd -G sudo -m packet
    $ passwd packet

Switch to the `packet` account with `su - packet` and execute,

    $ mkdir -p $HOME/.kube
    $ sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
    $ sudo chown $(id -u):$(id -g) $HOME/.kube/config

Next, we should deploy a pod network to the cluster. [Flannel](https://github.com/coreos/flannel/blob/master/Documentation/kube-flannel.yml) is an overlay network provider . To install the latest [release](https://github.com/coreos/flannel/releases) the flannel pod network execute the following command sequence:

    $ FLANNEL_RELEASE=v0.9.1
    $ kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/$FLANNEL_RELEASE/Documentation/kube-flannel.yml
    $ kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/$FLANNEL_RELEASE/Documentation/k8s-manifests/kube-flannel-rbac.yml

Set up worker nodes
-------------------

From the Packet cloud console create two more servers named `kube-worker-1` and `kube-worker-2`. Login to each of these nodes and execute the following commands to set them up:

    $ apt-get update && apt-get install -y apt-transport-https
    $ curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
    $ echo "deb http://apt.kubernetes.io/ kubernetes-xenial main" >> /etc/apt/sources.list.d/kubernetes.list
    $ apt-get update && apt-get install -y docker.io kubelet kubeadm kubectl kubernetes-cni
    $ swapoff -a && apt-get install linux-image-$(uname -r)

Next, invoke the `kubeadm join` command on each worker node to join the Kubernetes cluster. The same command that was obtained earlier from the output of `kubeadm init` command on the master node.

![](/media/images/XP4W-kc1.png)

From this point, unless specified otherwise, all listed commands should be executed on the master node as the `packet` user.  
Check the status of the nodes in the cluster by executing the following command :

    $ kubectl get nodes
    NAME            STATUS    ROLES     AGE       VERSION
    kube-master     Ready     master    10m       v1.8.4
    kube-worker-1   Ready     <none>    4m        v1.8.4
    kube-worker-2   Ready     <none>    31s       v1.8.4

Here you can see that our Kubernetes cluster consists of a master and two worker nodes and you could just as easily add more worker nodes to the cluster.

Setting up an Ingress controller
--------------------------------

To allow inbound connections to reach the cluster services we should install a ingress controller to the cluster. The easiest way to install an ingress controller is using the `helm` client.

[Helm](https://github.com/kubernetes/helm) is a package manager for Kubernetes and is a tool to manage pre-configured packages known as Charts to a Kubernetes cluster.  
Install the [latest version](https://github.com/kubernetes/helm/releases) of the `helm` client on the master node:

    $ HELM_RELEASE=v2.7.2
    $ wget -c https://storage.googleapis.com/kubernetes-helm/helm-${HELM_RELEASE}-linux-amd64.tar.gz
    $ tar zxf helm-${HELM_RELEASE}-linux-amd64.tar.gz --strip 1 linux-amd64/helm
    $ chmod +x helm
    $ sudo mv helm /usr/local/bin/helm

On clusters with role-based access control (RBAC) enabled, we need to [create a service account for tiller](https://github.com/kubernetes/helm/blob/master/docs/rbac.md#tiller-and-role-based-access-control) with the `cluster-admin` role and specify it while initializing tiller. Execute the following commands to create the service account with the required permissions.

    $ cat > rbac-config.yaml <<EOF
    apiVersion: v1
    kind: ServiceAccount
    metadata:
      name: tiller
      namespace: kube-system
    ---
    apiVersion: rbac.authorization.k8s.io/v1beta1
    kind: ClusterRoleBinding
    metadata:
      name: tiller
    roleRef:
      apiGroup: rbac.authorization.k8s.io
      kind: ClusterRole
      name: cluster-admin
    subjects:
      - kind: ServiceAccount
        name: tiller
        namespace: kube-system
    EOF
    $ kubectl create -f rbac-config.yaml

Now that a service account is created, deploy `tiller` to the cluster with:

    $ helm init --service-account tiller

We can now install the ingress controller simply by deploying the `stable/nginx-ingress` chart to the cluster using the `helm` CLI:

    $ helm install --name nginx-ingress stable/nginx-ingress --set rbac.create=true,controller.service.type=NodePort,controller.service.nodePorts.http=30080

With the above command the ingress controller exposes port `30080` of the master node outside the cluster. Any services deployed on the cluster which have an ingress endpoint (`kubectl get ingress`) can be reached externally at this port.

_To learn more about Kubernetes on Packet cloud, check out [https://support.packet.com/kb/articles/kubernetes](https://support.packet.com/kb/articles/kubernetes)._

Installing Kubeless
-------------------

Grab the [latest release](https://github.com/kubeless/kubeless/releases) of the Kubeless CLI and use the following command sequence to install it to the master node of your cluster.

    $ KUBELESS_RELEASE=v0.3.0
    $ sudo apt-get install -y unzip
    $ wget -c https://github.com/kubeless/kubeless/releases/download/${KUBELESS_RELEASE}/kubeless_linux-amd64.zip
    $ unzip kubeless_linux-amd64.zip
    $ chmod +x bundles/kubeless_linux-amd64/kubeless
    $ sudo mv bundles/kubeless_linux-amd64/kubeless /usr/local/bin/

Next, download the Kubeless deployment manifest,

    $ curl -LO https://github.com/kubeless/kubeless/releases/download/${KUBELESS_RELEASE}/kubeless-rbac-${KUBELESS_RELEASE}.yaml

Our Kubernetes cluster on Packet does not have support for the `PersistentVolumeClaim` storage type. As a temporary measure we’ll need to edit the manifest and remove it’s usage.

_P.S. It is not advisable to remove these persistent volumes on a production cluster as deleting/restarting Kubeless would result in a complete loss of the application state and all deployed functions._

Open the downloaded manifest file `kubeless-rbac-${KUBELESS_RELEASE}.yaml` and deleted the `volumeMounts` and `volumeClaimTemplates` definitions for the `kafka` and `zookeeper` `StatefulSets` and deploy the manifest to the cluster using the following commands:

    $ kubectl create namespace kubeless
    $ kubectl create -f kubeless-rbac-${KUBELESS_RELEASE}.yaml

Check the status of the deployment with the following command:

    $ kubectl get pods --namespace kubeless

You should have Kubeless successfully installed to the cluster and notice a `CustomResourceDefinition` (CRD) named `functions.k8s.io` added.

    $ kubectl get crd
    NAME               AGE
    functions.k8s.io   39m

Deploying functions
-------------------

Kubeless currently supports various of language runtimes for writing functions and you could also [add support for a new runtime](https://github.com/kubeless/kubeless/blob/master/docs/implementing-new-runtime.md). For this demonstration we’ll use the Python runtime to write a simple `greeting` function and deploy it to the cluster using the `kubeless` CLI.

Create a file named `hello.py` with a function named `greeting` as shown below:

    def greeting():
        return "hello, world!"

Save this file and deploy the function with the following command:

    $ kubeless function deploy greeting --runtime python2.7 \
                                    --from-file hello.py \
                                    --handler hello.greeting \
                                    --trigger-http

Check the deployment status of the function:

    $ kubeless function ls

After the deployment is in the `READY` state, execute the following command to call the function and you should see the output of the function, i.e. the text `hello, world!`, printed out.

    $ kubeless function call greeting

As we installed an Ingress controller (via the `stable/nginx-ingress` chart), we can set up an ingress endpoint for our function, allowing us to call the function externally over the internet.

    $ kubeless ingress create greeting --function greeting

Execute the following command to get the list of ingress routes currently set up and the host name for each of these routes.

    $ kubeless ingress ls
    +----------+-----------+----------------------------+------+--------------+--------------+
    |   NAME   | NAMESPACE |            HOST            | PATH | SERVICE NAME | SERVICE PORT |
    +----------+-----------+----------------------------+------+--------------+--------------+
    | greeting | default   | greeting.10.80.55.1.nip.io | /    | greeting     |         8080 |
    +----------+-----------+----------------------------+------+--------------+--------------+

Kubeless creates a default host name in form of `.nip.io`. Alternatively, you can provide a real host name with `--hostname` flag to the `kubeless ingress create` command. Please refer to the [ingress support documentation](https://github.com/kubeless/kubeless/blob/master/docs/ingress.md) for more details.

You can now call this function externally (over the internet) with:

    $ curl --header "Host: FUNCTION_HOST" MASTER_NODE_IP_ADDRESS:30080

_Replace the placeholders `FUNCTION_HOST` and `MASTER_NODE_IP_ADDRESS` with the host name of the ingress route to the function and the IP address of the master node._

Upon execution you should see the text `hello, world!` printed out on the terminal.

With Kubeless we were able to effortless deploy a simple function to the Kubernetes infrastructure without having to worry about web servers, virtual host configurations and so on.

This was a basic demonstration of deploying a function and executing it over the internet. To get a glimpse of the use-cases you could unlock using Kubeless watch the following demo video.

To learn more about Kubeless refer to Bitnami's [documentation](https://github.com/kubeless/kubeless/tree/master/docs) and discuss in the #kubeless channel over at the [Bitnami OSS Slack](https://bitnami-oss.slack.com/) community. Visit [http://slack.oss.bitnami.com/](http://slack.oss.bitnami.com/) for an invite to join the community.
