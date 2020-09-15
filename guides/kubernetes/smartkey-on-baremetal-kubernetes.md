<!-- <meta>
{
	"title": "Equinix SmartKey KMS Plugin on Bare Metal Kubernetes",
	"description": "Installing and configuring the Equinix SmartKey KMS Plugin for Kubernetes on Packet Bare Metal",
	"tag": ["Kubernetes"],
	"seo-title": "Equinix SmartKey KMS Plugin on Bare Metal Kubernetes - Packet Technical Guides",
	"seo-description": "Equinix SmartKey KMS Plugin on Kubernetes on Packet",
	"og-title": "Equinix SmartKey KMS Plugin on Bare Metal Kubernetes",
	"og-description": "Installing and configuring the Equinix SmartKey KMS Plugin for Kubernetes on Packet Bare Metal"
}
</meta> -->

Kubernetes supports the use of [Key Management Services (KMS)](https://kubernetes.io/docs/tasks/administer-cluster/kms-provider/) for storing `Secret` resources with at-rest encryption through the use of KMS plugins. [Equinix SmartKey](https://amer.smartkey.io/#/) now offers a [Kubernetes KMS plugin for use with SmartKey](https://github.com/equinix/smartkey-kubernetes-kms).

## Requirements

You'll need an [Equinix SmartKey](https://github.com/equinix/smartkey-kubernetes-kms) account. Once your account is activated, and logged in, you will need to create a group:

![SmartKey UI Add Group](/images/smartkey-group-create.png)

and an application API key:

![SmartKey Add Application](/images/smartkey-application.png)

and then copy your API key:

![SmartKey App API Key](/images/smartkey-api-key.png)

The last step in the SmartKey UI is to create a security object, and retrieve your UUID for use with your Kubernetes cluster:

![SmartKey Security Object Create](/images/smartkey-security-object.png)

then select your object to retrieve the UUID.

You will also need to make note of the SmartKey endpoint you are using (i.e. https://amer.smartkey.io)

## Deployment

You must already have a running Kubernetes cluster in order to use SmartKey KMS plugin. The plugin will run on each of your cluster manager nodes. 

If you are a Kubeadm user, you can use the [deployment guide on GitHub](https://github.com/equinix/smartkey-kubernetes-kms) to update yyour `kube-apiserver.yaml` manifest to detect the plugin after configuring the plugin.

On each control plane node, create a file, `/etc/smartkey/smartkey-grpc.conf`:

```json
{
 "smartkeyApiKey": "Your SmartKey API Token",
 "encryptionKeyUuid": "Your Security Object UUID",
 "iv": "",
 "socketFile": "/etc/smartkey/smartkey.socket",
 "smartkeyURL": "https://amer.smartkey.io/"
}
```

Your `iv` is the initialization vector for your AES algorithm for your security object-- typically, in Equinix SmartKey, if one is not defined, it will be randomly generated, however, for the KMS plugin, one must be provided. 

Before starting the SmartKey agent (either as a service described in the installation guide, or as a standalone binary), Kubernetes also requires an `EncryptionConfig` resource be present (which you will need to refer to when updating your API server to point to your KMS plugin socket file). In `/etc/smartkey/smartkey.yaml`, define the following:

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
  - resources:
    - secrets
    providers:
    - kms:
        name: smartkey
        endpoint: unix:///etc/smartkey/smartkey.socket
        cachesize: 100
        timeout: 3s
    - identity: {}
```

It is important that `kms` appear in the provider list above `identity` in order to use SmartKey for any new secrets, and to re-encrypt existing ones, which you can do following confirming the SmartKey service is running by doing the following:

```bash
kubectl get secrets --all-namespaces -o json | kubectl replace -f -
```

You can, then, back in the SmartKey UI, check your Systems events pane to see when crypto operations are occurring:

![SmartKey System Events View](/images/smartkey-logs.png)

More about what can be done with SmartKey can be found in the [Equinix SmartKey Developer Guide](https://developer.equinix.com/catalog/smartkeyv1). 

