<!-- <meta>
{
    "title":"Container Network Benchmarking on Kubernetes",
    "description":"Container Network Benchmarking on Kubernetes",
    "tag":["Kubernetes", "Networking", "Performance," "Docker"],
    "seo-title": "Container Network Benchmarking on Kubernetes - Packet Technical Guides",
    "seo-description": "Container Network Benchmarking on Kubernetes",
    "og-title": "BGP Global Communities",
    "og-description": "Container Network Benchmarking on Kubernetes"
}
</meta> -->

# Container Network Benchmarking on Kubernetes

Network performance is a strong consideration in any highly-distributed, highly-available architecture, and on bare metal, for Kubernetes in particular, this consideration extends from your machines' physical network, to your network overlays used by your workload Pods, and any other networking between physical locations, etc. Benchmarking performance for a container network, and for a Kubernetes cluster, can be done using much the same tooling as one might on a traditional server deployment model, and can actually be enhanced using features built into Kubernetes, as well as its tools to debug and observe behavior on the cluster networks. 

## Overview

The [`iperf` tool has been used to benchmark network performance](https://linux.die.net/man/1/iperf), using a variety of options for conducting throughput tests from a server and client machine. This only requires `iperf` being started in server mode:

```
iperf -s
```

on one machine, and using client options on another:

```
iperf -c iperf-server -P 10
```

for example, the above connects to your server, and conducts a standard test on throughput, using the `-P` argument to define the number of parallel connections (client threads) over which to test.

This principle will still apply on an overlay network, of the types used in Kubernetes network, including your common CNI options, using containers on the network as clients and server endpoints. 

## Preparing the iperf image

To run `iperf` on a container network, or in a Kubernetes cluster, it will need to be packaged in a container, and a `Dockerfile` for such an image would look like:

```
FROM alpine:latest

RUN apk --update add iperf

ENTRYPOINT iperf -s 
```

then, proceed to build and tag it:

```
docker build -t user/iperf
```

and push to your registry, or Docker Hub.

## Testing your container network


In this example, I'm going to use a persistent, single `Pod` running as a `Service` on the cluster as a server, and a Kubernetes `Job` resource as a client, so in the future, for additional tests, I can spawn a new `Job` and run a new test, and it will clean up the `Pod` when I'm done with the test, using the same Server:

```
apiVersion: v1
kind: Pod
metadata:
  name: iperf-overlay-server
  labels:
    app: iperf-overlay-server
spec:
  containers:
  - name: iperf-overlay-server
    image: user/iperf:latest
    ports:
    - containerPort: 5001
---
kind: Service
apiVersion: v1
metadata:
  name: iperf-overlay-server
spec:
  selector:
    app: iperf-overlay-server
  ports:
  - protocol: TCP
    port: 5001
    targetPort: 5001
```

Like you saw above, the `user/iperf` image just starts a server using `iperf -s` and we're exposing the port 5001 on the hostname `iperf-overlay-server.default` within our cluster. 

In this case, the results will be logged as STDOUT for the server `Pod` (and will persist as long as the Pod does), but for persistent storage, we can attach a Volume, for example, and write these to a file on the volume and just override the default command for the Server:

```
...
   - name: iperf-overlay-server
     image: user/iperf:latest
     command: ["iperf","-s",">>","/mnt/iperf-data"]
     volumeMounts:
     - name: iperf-data
       mountPath: /mnt/iperf-data
...
```

or write to Prometheus, to track and visualize the data alongside your other metrics. I won't cover this in detail here, but how you persist the data, depending upon how you use it, can vary.

Now, we're ready to define the `Job`, which we'll use to run a client-based test:

```

apiVersion: batch/v1
kind: Job
metadata:
  name: iperf-overlay-client
spec:
  template:
    metadata:
      labels:
        app: iperf-overlay-client
    spec:
      containers:
      - name: iperf-overlay-client
        image: user/iperf:latest
        command: ["iperf", "-c", "iperf-overlay-server", "-P", "10"]
      restartPolicy: Never
  backoffLimit: 4
```

We're using `command` to override starting the server, and defining our client job parameters:

```
iperf -c iperf-overlay-server -P 10
```

so on that `command` line, you can modify the client, for example, to meet the standards you'd like to benchmark for. 

Once the `Job` has been created:

```
kubectl create -f iperf-client-job.yaml
```

You can verify the output from the server:

```
kubectl logs -l app=iperf-overlay-server
```

and the client `Job`:

```
kubectl logs -l app=iperf-overlay-client
```

to see your test results.


## Host-level network performance

As you might've guessed, `iperf` has been used to test physical networks for a long time, and as you saw, our test here runs those sorts of tests on the container network, an overlay on the physical network your cluster nodes are running on. 

You can use Kubernetes-based services to test the physical network as well, if you'd like, using a similar pattern. 

This example, as you saw, was intended to benchmark the performance of the SDN Overlay Network, however, this test can be re-run for the `host` network by adding the `hostNetwork: true` option to the server `Pod` and client `Job` specs--this, however, requires [a permissive PodSecurityPolicy](https://kubernetes.io/docs/concepts/policy/pod-security-policy/#host-namespaces).

In this scenario, you might, for example, submit `Job` client requests from a remote cluster to test things like replication over a WAN, or from within cluster, just physical networking between nodes if there are performance issues that are not manifest in the overlay. 

One can run different types of tests by overriding the default behavior of the `user/iperf` container (starting a server using `iperf -s`), using the `command` key in the Pod and Job specs and [modifying the `iperf` benchmarking to be done](https://openmaniak.com/iperf.php), respectively. 

## Additional Reading

More on `iperf` can be found here:

- [IPERF The Easy Tutorial](https://openmaniak.com/iperf.php)
- [Network Throughput Testing with iperf](https://www.linode.com/docs/networking/diagnostics/install-iperf-to-diagnose-network-speed-in-linux/)

More on Kubernetes network modes and security policies can be found here:

- [How Does The Kubernetes Networking Work?](https://medium.com/@tao_66792/how-does-the-kubernetes-networking-work-part-1-5e2da2696701)
- [Pod Security Policy (Host Namespaces)](https://kubernetes.io/docs/concepts/policy/pod-security-policy/#host-namespaces)
- [Kubernetes security context, security policy, and network policy](https://sysdig.com/blog/kubernetes-security-psp-network-policy/)

To run this example on a schedule, Kubernetes also support `CronJob` resources:

- [CronJobs](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/)

A set of example `Job` and `Service` resources for running `iperf` on Kubernetes can be found here:
- [jmarhee/container-network-benchmarking](https://bitbucket.org/jmarhee/container-network-benchmarking/src/master/) 