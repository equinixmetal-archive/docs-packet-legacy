Explore Weave and Kubernetes

_Note: This post was prepared by our friends at [Weaveworks](https://weave.works)._

In this guide we'll show you how to use Weave Cloud to explore and troubleshoot a microservices app running in Kubernetes on Packet's bare metal cloud.

[Weave Cloud](https://www.weave.works/solution/cloud/) brings together all four open source projects from Weaveworks, providing an end-to-end development pipeline to deliver apps to the cloud:

* Weave Scope for troubleshooting
* Weave Flux for continuous delivery
* Weave Cortex for Prometheus Monitoring
* Weave Net for container networking and security.

We'll use Weave Scope in Weave Cloud to troubleshoot a Kubernetes cluster as you set up and configure it. Then we'll deploy the Sock Shop, a microservices app, onto it, and with Weave Scope and Weave Cloud we'll explore the microservices as they run in Kubernetes.  At the end of this tutorial you'll see how Weave Scope and Weave Cloud are essential tools for configuring and troubleshooting apps as they run in the cloud.

## Advantages of Using Bare Metal Servers

Bare metal hasn't traditionally been the infrastructure flavor of choice for automation-hungry developers, who mainly opt for VM's at clouds like AWS.  But with the advent of fully automated solutions like Packet, excitement around bare metal is growing.

What are some of the advantages of running your app on bare metal?

* **Performance** - With bare metal, you get an entire server (Packet offers five options) with no shared resources.  This single tenancy reduces the "noisy neighbour" effect, giving you full and consistent access to a server's resources.  This usually results in better performance for your workload.
* **Cost** - With no overhead from virtualization (the "hypervisor tax"), complexity is reduced and you can get a lot more compute performance for a lower cost, especially at larger scale.
* **Transparency** - With full access to a machine, you can get better insights into performance bottlenecks, network latency, and other factors that can influence your application.

Now that you know what you'll be using and why in this tutorial, let's get started!

## Sign up for Weave Cloud

To begin, you'll need to sign up for Weave Cloud and make a note of the Weave Cloud service token which we'll be using later on in this tutorial.

1. Go to [Weave Cloud](https://cloud.weave.works/).
2. Sign up using either a Github, or Google account or use an email address.
3. Obtain the cloud service token from the user settings screen. You will use the token later on in this tutorial:

![](/assets/images/giudes-kubernetes/image08.png) Weave Cloud Token

## Signup, Create a Project, and Add Your SSH Keys at Packet

Create a new account here at [Packet.com](https://www.packet.com/) (or login to an existing one).  Some accounts are flagged for a manual review, but usually this is an instant process.  Create a new project and give it a name.  Then either generate new ssh keys or add an existing private key to your Packet profile.

**Next, you'll want to create three Ubuntu servers.**From the Packet setup console, create three Ubuntu 16.04 servers with at least 8GB of memory on each.  For this tutorial, I used three "Type 0" servers, which at only $.05/hr should still be more than sufficient to run our sample app in Kubernetes.

![](/assets/images/giudes-kubernetes/image05.png) Defining a Project in Packet

## Create a Kubernetes Cluster

In these next few steps, you will create a Kubernetes cluster using Kubeadm.  Kubeadm is by far the easiest way to setup a Kubernetes cluster. In less than five commands, an entire Kubernetes cluster will be set up, configured and ready for your app.

### 1.  Install the Kubeadm, Kubelet and Docker Binaries

For each host, SSH onto the machine and become root (for example `sudo su -`) then run the following:

```bash

curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
cat <<EOF > /etc/apt/sources.list.d/kubernetes.list
deb http://apt.kubernetes.io/ kubernetes-xenial main
EOF
apt-get update
# Install docker if you don't have it already.
apt-get install -y docker.io
apt-get install -y kubelet kubeadm kubectl kubernetes-cni
```

If you get an error like this:

```bash

E: The method driver /usr/lib/apt/methods/https could not be found.

N: Is the package apt-transport-https installed?
```

Then you need to install the https transports:

```bash

apt-get install apt-transport-https
```

 Re-run the first set of commands to download all of the kubernetes and Docker binaries:

### 2. Start the Docker Service & then check that kubectl is installed

Before proceeding, ensure that Docker is running on all of your nodes:

```bash

systemctl start docker.service
```

Also, check that the kubectl service is installed and ready:

```bash

kubectl
```

The kubectl command service is the command line utility that allows you to manage all of the services on a Kubernetes cluster.

### 3. Initialize One of the Nodes as Master

Of the three hosts that you just set up, choose one to be the master.  The master node is where you run all of the Kubernetes commands using the kubectl service. The master node is responsible for scheduling the jobs out to the other two worker nodes. All commands to deploy, manage and schedule are run from the master node in Kubernetes.  

On one of the nodes, run:

```bash

kubeadm init
```

Where you should see the following output:

```bash

Your Kubernetes master has initialized successfully!
```

You should now deploy a pod network to the cluster. Run

```bash

kubectl apply -f [podnetwork].yaml
```

With one of the options listed at: [http://kubernetes.io/docs/admin/addons/](http://kubernetes.io/docs/admin/addons/)

You can now join any number of machines by running the following on each node:

```bash

kubeadm join --token=<token-id> <master IP>
```

Make a note of the last line in this output.  You will need this to join up the other two nodes in the cluster.

#### Error Messages and How to Fix Them

If you run into an error like this, after running kubeadm init:

```bash

failed to parse kernel config: unable to load kernel module "configs": output - "modprobe: FATAL: Module configs not found in directory /lib/modules/4.4.0-47-generic\n", err - exit status 1
```

You may need to update one of the Kernel mods because of an issue with the system check.  For more information about this issue, you can refer to:

[https://github.com/kubernetes/kubernetes/issues/41025](https://github.com/kubernetes/kubernetes/issues/41025)

Run the following on all three nodes, but don't install GRUB, as it is not necessary:

```bash

apt-get install linux-image-$(uname -r)
```

From the GRUB screen that appears select,  'Keep the local version' and then continue without using GRUB.

After installing the update, re-run the `kubeadm init` command on the intended master node.

### 4. Installing a Pod Network with Weave Net

Next you will install Weave Net to use for the pod network so that all of your pods can communicate with each other.

Installing Weave Net on a Bare Metal Server<br>

On Packet.net there are few extra steps you must take to avoid collisions with the server's backend network. To avoid these conflicts, launch Weave with a specific address pool ('weave launch --ipalloc-range 192.168.0.0/16') that will be used by the IP address manager.

From within the Packet console, you can conveniently view, request and manage IP address blocks for all of your deployed servers.

![](/assets/images/giudes-kubernetes/image01.png) Manage IP Blocks from within Packet

In Kubernetes Weave Net runs as a DaemonSet, and it is configured using a yaml file. Edit this file to include an appropriate IP allocation address pool before you launch Weave Net.

Get the yaml file:

Download the weave-kube yaml file to the master node using:

```bash

wget https://git.io/weave-kube
```

With your favourite editor,  I use vi, add the following section to weave-kube file and save the file as weave-kube.yaml:

```yaml

containers:
	- name: weave
		env:
			- name: IPALLOC_RANGE
			  value: 192.168.0.0/16
		image: weaveworks/weave-kube:1.9.0
		imagePullPolicy: Always
```

Adding the range  192.168.0.0/16  ensures that Weave Net's default private address space doesn't interfere with Packet's own internal address space.  Note that yaml files are super picky about spaces.  Please ensure that the spacing is correct before launching this file.

For more information about this you can refer to "Creating an Overlay Network on Packet"  and also Integrating Kubernetes via the Add-on in the Weave Net docs.

Save the .yaml file to the Master node. Now you are ready to launch the pod network.  You can do that by running:

```bash

kubectl apply -f weave-kube.yaml
```

The output will be:

```bash

daemonset "weave-net" created
```

### 5. Before joining nodes, ensure that kube-dns is running

Once a pod network is installed, confirm that it is working by checking that the kube-dns pod is up and running:

```bash

kubectl get pods --all-namespaces
```

Where you should see something similar to that below:

```bash

kube-system dummy-2088944543-r5xb8 								1/1 	Running 	0 	44m
kube-system etcd-kube-master.local.lan 							1/1 	Running 	0 	43m
kube-system kube-apiserver-kube-master.local.lan 				1/1 	Running 	3 	43m
kube-system kube-controller-manager-kube-master.local.lan 		1/1 	Running 	0 	44m
kube-system kube-discovery-1769846148-9f14v 					1/1 	Running 	0 	44m
kube-system kube-dns-2924299975-x34f1 							4/4 	Running 	0 	44m
kube-system kube-proxy-7jtck 									1/1 	Running 	0 	44m
kube-system kube-scheduler-kube-master.local.lan 				1/1 	Running 	0 	43m
kube-system weave-net-rgkqj 									2/2 	Running 	0 	1m
```

### 6. Join all Nodes to the Master to Create Cluster

With your Kubernetes all up and running and all pods in communication, you're ready to join the nodes to create the cluster:

```bash

kubeadm join --token <token> <master-ip>
```

Run the get nodes command on the master to see the nodes joined:

```bash

kubectl get nodes
```

Where you should see something similar to the following:

```bash

NAME						STATUS 				AGE
kube-master.local.lan 		Ready,master 		25m
kube-node-1.local.lan 		Ready 				1m
kube-node-2.local.lan 		Ready 				59s
```

### 7. Launch the Weave Cloud Probes

Launch all of the Weave Cloud probes by starting DaemonSets. With all of the probes connected to your hosts,  you can set up [Continuous Delivery with Flux](https://www.weave.works/solution/continuous-delivery/), [explore and troubleshoot](https://www.weave.works/solution/troubleshooting-dashboard/) and finally monitor the app with [Prometheus and Weave Cortex](https://www.weave.works/solution/prometheus-monitoring/).

Paste this line into the terminal on the master node:

```bash

curl -sSL 'https://cloud.weave.works/k8s.yaml?service-token=<CLOUD_SERVICE_TOKEN>'|kubectl apply -f -
```

Replace the <CLOUD_SERVICE_TOKEN> with the token you recorded earlier from your instance settings page at https://cloud.weave.works.

If you accidently ran the command without your Weave Cloud token, delete the DaemonSet and rerun the command.

Uninstall the DaemonSets with:

```bash

kubectl delete -f https://cloud.weave.works/k8s.yaml?t=anything
```

Relaunch all of the probes by re-running the above command.

### 8. View Kubernetes in Weave Cloud

Go to Weave Cloud, click Explore and then select the Pods view. To see the kubernetes containers, ensure that the Kube-system namespace is selected from the left-hand corner of the screen.

![](/assets/images/giudes-kubernetes/image02.png) Kubernetes in Weave Cloud

### 9. Deploy our sample microservices app: the Sock Shop

Let's deploy the Sock Shop to the cluster by running the following on the master node:

```bash

kubectl create namespace sock-shop
git clone https://github.com/microservices-demo/microservices-demo
cd microservices-demo
kubectl apply -n sock-shop -f deploy/kubernetes/manifests
```

Check that all of the containers are appearing correctly:

```bash

kubectl get pods -n sock-shop
```

You can also watch as the Sock Shop containers spin up from within Weave Cloud by selecting the Containers view.

![](/assets/images/giudes-kubernetes/image02.png) The Sock Shop in Weave Cloud

### 10. Explore the App in Kubernetes with Weave Cloud

Now that you have the Sock Shop running smoothly in a Kubernetes cluster, use Weave Cloud to explore further, and inspect all of the different services and how they communicate with one another.

But to really see the connections between services, you'll need to put a bit of load on the app.

Display the Sock Shop in your browser with: http://<master node IP:node port>.

The node port should be 30001, but you can check that by running:

```bash

kubectl describe svc front-end -n sock-shop
```

Next add few pairs of socks to the cart and then return to Weave Cloud.

![](/assets/images/giudes-kubernetes/image06.png)

#### Interacting with Containers, Pods and Hosts

One of the most powerful features of Weave Cloud is the ability to interact with containers in real time, as it runs in the cloud.  For example, if you need to troubleshoot the cluster, the first place to look might be to examine the logs.  This is easily handled through the Weave Cloud interface.  

#### View Pod Logs

Select the Pods view and then enter 'kube-api` into the search field.  Click on the kube-api container to view its details and metrics.  From the container details panel, display the current Pods logs.  Popping out this window provides live stream of the logs as you investigate other areas of your app or cluster.

![](/assets/images/giudes-kubernetes/image00.png)

#### Interact With Containers & Hosts in Real Time

Another powerful feature of Weave Cloud is the ability to interact directly with containers, pods and hosts all from a single dashboard from within Weave Cloud.

As an example, click on Hosts and select the Master node.  From the details panel that appears, select `<` to open a terminal.  From here you can type 'kubectl' commands or any UNIX command, as you troubleshoot issues with your running kubernetes cluster.  You can do the same with Containers and Processes.  For example, select the Cart container, click `<` to open a terminal and enter 'top` to see a list of all processes running inside that container.

![](/assets/images/giudes-kubernetes/image04.png) Running Commands inside of Container

#### Monitoring with Weave Cortex

Prometheus monitoring with Weave cortex solves the problem of monitoring in a dynamic system such as Kubernetes.  Weave Cortex is an extension of the open source project Prometheus and once deployed to your cluster, it listens for changes within a Kubernetes cluster or even across a Kubernetes federation.

With the Weave Cortex probes already connected in this tutorial, you can click on Monitoring. There are several reports already configured and available, but to get even more out of Prometheus, you can build your own queries and create custom reports with the Prometheus Query Language.  

The query below displays the CPU usage by Pod:

![](/assets/images/giudes-kubernetes/image07.png) CPU Usage by Kubernetes Pods

#### Tear Down

* To uninstall the socks shop, run kubectl delete namespace sock-shop on the master.
* To uninstall Kubernetes on the machines, simply delete the machines you created for this tutorial, or run the following reset command:

```bash

kubeadm reset
```

#### Final Thoughts

Weave Cloud gives you real-time monitoring of your containers, orchestrators, and microservices in order to understand and troubleshoot bugs and issues in containerized applications. In conjunction with your DevOps team, Weave Cloud can also provide continuous delivery of microservices by automating the tedious steps required to create container images and deploying the service, including generating configuration files and checking them into source code control.

If you require additional step-by-step instructions for setting up your environment, see [Weaveworks guides](https://www.weave.works/guides/) that describe how to Troubleshoot and Verify your app, and how set up and implement Continuous Delivery, Monitoring and Security.

If you're looking to leverage the power of Weave Scope and Weave Cloud for your microservices applications, sign up for the trial of [Weave Cloud](https://cloud.weave.works/).
