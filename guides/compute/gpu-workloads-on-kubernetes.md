<!-- <meta>
{
    "title": "Kubernetes for GPU Workloads",
    "description": "Learn how to leverage GPUs within Kubernetes using the native tooling available in your cluster.",
    "tag": ["Kubernetes", "Docker", "GPU"],
    "seo-title": "Preparing Kubernetes for GPU Workloads - Packet Technical Guides",
    "seo-description": "Preparing Kubernetes for GPU Workloads",
    "og-title": "Leverage Kubernetes for GPU workloads.",
    "og-description": "Learn how to utilize GPUs within Kubernetes using the native tooling available in your cluster."
}
</meta> -->


# Preparing Kubernetes for GPU Workloads

As of version 1.10, [Kubernetes has support for GPU accelerated workloads](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/). Packet’s line of GPU-accelerated machines make an excellent substrate for containerized workloads leveraging GPUs within Kubernetes using the native tooling available in your cluster.

However, unlike traditional containerized workloads, some additional setup to add driver and plugin support for the GPU devices is required to configure Docker and Kubernetes to schedule resources for them.

## Setup

The [NVIDIA container runtime](https://developer.nvidia.com/nvidia-container-runtime) creates a backend for Docker to connect to in order to run containers with GPU acceleration, so much like any other container runtime supported by Kubernetes, this backend can be made available to Kubernetes, which we will need to setup first.

Configuring your nodes, if you are using a diverse group of hardware types within your cluster, will require a couple of pre-requisites on your GPU-equipped nodes:

1 . [Docker and the nvidia-docker package need to be installed](https://github.com/NVIDIA/nvidia-docker#quickstart).
2. [The NVIDIA container runtime may need be set](https://github.com/NVIDIA/k8s-device-plugin#preparing-your-gpu-nodes) on your nodes’ Docker daemon configuration, depending which `nvidia-docker` package is being used.
3 .You can also make [node preparation part of your worker spin-up routine](https://gist.github.com/derekmerck/7b109745f0d0e42c7ea75bb3536907cd).
4. Enabling GPU support for your cluster by [applying the NVIDIA device DaemonSet to your cluster](https://github.com/NVIDIA/k8s-device-plugin#enabling-gpu-support-in-kubernetes).

This will use the specialized runtime for GPU-targeted workloads on the nodes that those workloads will be scheduled to, and by adding the Nvidia device plugin to your cluster, once scheduled, nodes with this specialized hardware can receive these pods as scheduled.

## Scheduling your workloads

Kubernetes replication controllers like `DaemonSets` and `Deployments` allow you to target these Pods (and the accompanying replication controller) onto `taint`-ed nodes by setting a `toleration` in your spec in order to effect the scheduling rules for workloads of a certain type, onto a node tainted for whatever reason.

In this case, the nodes with GPUs will have a taint indicating it is a GPU node:

```
nvidia.com/gpu
```

So, you can, then, target a pod set to GPU nodes by setting a toleration like:

```
apiVersion: extensions/v1beta1
kind: DaemonSet
metadata:
  name: some-gpu-workload
  namespace: default
spec:
...
    spec:
      tolerations:
      - key: nvidia.com/gpu
        operator: Exists
        effect: NoSchedule
```

Which means that nodes that do not carry the `nvidia.com/gpu` key taint, will be unschedulable when this key exists in a deployment; in the above example, a `DaemonSet` will traditionally run on all nodes in a cluster, so with this toleration in place, you can target a complete subset of nodes matching that toleration to taints on the nodes, in this case, the presence of the GPU, surfaced through this identifier.

Alternatively, more broadly as hardware diversity grows in your environment, you may also use a traditional `nodeSelector` in your spec to identify GPUs of a specific type, by first [labelling the nodes](https://kubernetes.io/docs/tasks/configure-pod-container/assign-pods-nodes/), and then in your Pod spec:

```
  nodeSelector:
    accelerator nvidia-${model}
```

which defines the accelrator GPU model that is appropriate for the workload in question.

## Additional Resources

If you use GPU-accelerated software now, or if you are new to the space, and want to see how Kubernetes/Containers can help, there are some common use cases for GPU-based workloads that fit right into a container, and benefit from a tightly controlled orchestration platform for those resource lifecycles like compute cycles, etc. are things like data science and machine learning software, such as:

- [PyTorch](https://medium.com/dsnet/training-deep-neural-networks-on-a-gpu-with-pytorch-11079d89805)
- [TensorFlow](https://www.tensorflow.org/guide/gpu)

and [all manner of high-performance parallel programming tasks](https://developer.nvidia.com/udacity-cs344-intro-parallel-programming) for containerized tasks, or one-off workloads like Kubernetes `Job` resources or as a backend for FaaS operations.