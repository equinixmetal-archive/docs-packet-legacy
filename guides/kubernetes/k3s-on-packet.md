<!-- <meta>
{
    "title":"Running k3s on Packet",
    "description":"k3s is the lightweight, easy to deploy and easy to manage certified Kubernetes distribution, and it runs perfectly on Packet.",
    "tag":["Kubernetes", "k3s"],
    "seo-title": "Running k3s on Packet - Packet Technical Guides",
    "seo-description": "Running k3s on Packet",
    "og-title": "Resources for running k3s on Packet",
    "og-description":"Running k3s on Packet",
    "featured": true
}
</meta> -->

[Kubernetes](https://kubernetes.io) is the gold standard for production-grade application management and orchestration. [k3s](https://k3s.io) is the
lightest weight and easiest to deploy and manage certified Kubernetes distribution.

## k3s at Packet

This guide describes how to deploy k3s on Packet. In line with k3s, it is fairly straightforward. However, if you want an all-in [terraform](https://terraform.io)
project, Packet labs has one for you at [Packet k3s](https://github.com/packet-labs/packet-k3s).

## Deployment

For any deployment, ensure you have an account at Packet and either are logged into the portal or have an API key for your automation, e.g. [Packet CLI](https://github.com/packethost/packet-cli)

### Single Master

1. Deploy one master and as many workers as you want. For a basic cluster, `t1.small` is fine. The more and busier workloads you want to deploy, the larger nodes you will need.
1. `ssh` to your master and become root
1. Download `k3s` on each node:

```
# set your version
VERSION="v1.17.4%2Bk3s1"
curl -o /usr/local/bin/k3s https://github.com/rancher/k3s/releases/download/${VERSION}/k3s
chmod +x /usr/local/bin/k3s
```

1. On the master, start kubernetes via `k3s` in "server mode". Be aware that this process will run in the foreground, so you might need another shell. Note that the first option disables the _internal_ (to k3s) cloud controller, while the second allows us to use an external one, i.e. Packet's.

```
k3s server --disable-cloud-controller --kubelet-arg cloud-provider=external
```

1. On the master, retrieve the token for workers, which is at `/var/lib/rancher/k3s/server/token`. It will look something like: `K10d307ff85c60d010d027edf1dc327f1ba38c2665a2f6345d3d62a4036aeba36b6::server:697d5ca939d1e1d900b7ca8664c48634`
1. On each worker, start kubernetes via `k3s` in agent mode. Be aware that this process will run in the foreground. Note that the `--kubelet-arg` below allows us to use an external cloud controller, i.e. Packet's, while the second argument is the token you retrieved in the previous step, and the third argument is the address of the master.

```
k3s server --kubelet-arg cloud-provider=external --token K10d307ff85c60d010d027edf1dc327f1ba38c2665a2f6345d3d62a4036aeba36b6::server:697d5ca939d1e1d900b7ca8664c48634 --server https://139.178.64.61:6443
```

1. On the master, retrieve the admin kubeconfig, which is at `/etc/rancher/k3s/k3s.yaml`
1. Apply the [Packet cloud controller manager (CCM)](https://github.com/packethost/packet-ccm); see the link for more details. The short form is:
   * Apply the secret
   * Apply the configuration and deployment

Your cluster now is running.

#### External Access

To access the cluster from externally, e.g. from your laptop:

1. Copy the admin kubeconfig you retrieved in deployment to your local workstation, e.g. `~/.kube/k3s-admin`
1. Modify the file so that the `server: ` line uses the public IP of your server. By default, k3s deploys it with the loopback, i.e. `https://127.0.0.1:6443`
1. Set the env var `KUBECONFIG` to point to your locl copy, e.g. `export KUBECONFIG=~/.kube/k3s-admin`
1. Run `kubectl` commands at will.

