<!-- <meta>
{
    "title": "Kubernetes CSI for Packet",
    "description": "Kubernetes CSI (Container Storage Interface) for Packet",
    "tag": ["Kubernetes", "CSI", "Container Storage Interface"],
    "seo-title": "Kubernetes CSI for Bare Metal - Packet Technical Guides",
    "seo-description": "Kubernetes CSI (Container Storage Interface) for Packet",
    "og-title": "Kubernetes Cluster Autoscaler",
    "og-description": "Kubernetes CSI (Container Storage Interface) for Packet"
}
</meta> -->


# Kubernetes CSI (Container Storage Interface) for Packet

## Introduction:


The [Kubernetes CSI](https://kubernetes.io/blog/2019/01/15/container-storage-interface-ga/) is intended to allow clusters to provision, and attach `PersistentVolumes` as Kubernetes `StorageClasses` from a variety of storage providers via this standard. In this case, Packet's [Elastic Block Storage](https://support.packet.com/kb/articles/elastic-block-storage). 

## Requirements:

You’ll need to clone the Packet CSI [repository](https://github.com/packethost/csi-packet) to get the necessary yaml deployment files. The files are located in the `deploy/kubernetes` [folder](https://github.com/packethost/csi-packet/tree/master/deploy/kubernetes).

Deploying the CSI driver will also require the creation of a `Secret`.

### Version
Recommended versions of Packet CSI based on your Kubernetes version:
* Packet CSI version v1.0.0 supports Kubernetes >=1.13.0

## Deployment

### Token
To run the Packet CSI, you need your Packet API key and project ID that your cluster is running in.
If you are already logged in, you can create one by clicking on your profile in the upper right then "API keys".
To get project ID click into the project that your cluster is under and select "project settings" from the header.
Under General you will see "Project ID". Once you have this information you will be able to fill in the config needed for the CCM.

#### Create config
Copy [deploy/template/secret.yaml](https://github.com/packethost/csi-packet/blob/master/deploy/template/secret.yaml) to releases/packet-cloud-config.yaml:
```bash
cp deploy/template/secret.yaml packet-cloud-config.yaml
```

Replace the placeholder in the copy with your token. When you're done, the packet-cloud-config.yaml should look something like this:
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: packet-cloud-config
  namespace: kube-system
stringData:
  cloud-sa.json: |
    {
    "apiKey": "abc123abc123abc123",
    "projectID": "abc123abc123abc123"
    }
```

Then run:
```bash
kubectl apply -f packet-cloud-config.yaml
```

You can confirm that the secret was created in the `kube-system` with the following:
```bash
$ kubectl -n kube-system get secrets packet-cloud-config
NAME                  TYPE                                  DATA      AGE
packet-cloud-config   Opaque                                1         2m
```

### CSI
You can apply the rest of the CSI by running:

```bash
kubectl -n kube-system apply -f deploy/kubernetes/setup.yaml
kubectl -n kube-system apply -f deploy/kubernetes/node.yaml
kubectl -n kube-system apply -f deploy/kubernetes/controller.yaml
```

or by using the Packet [Helm Chart for CSI](https://github.com/packet-labs/helm-charts/).
