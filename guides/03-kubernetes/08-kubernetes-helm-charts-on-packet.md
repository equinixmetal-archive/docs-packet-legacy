<!-- <meta>
{
    "title":"Helm Charts for Kubernetes",
    "description":"Helm Charts for Kubernetes Package Management",
    "tag":["Kubernetes", "Package Management", "Helm"],
    "seo-title": "Helm Charts for Kubernetes Package Management - Packet Technical Guides",
    "seo-description": "Helm Charts for Kubernetes Package Management",
    "og-title": "Helm Charts for Kubernetes Package Management",
    "og-description": "Helm Charts for Kubernetes Package Management"
}
</meta> -->

# Helm Charts for Kubernetes Package Management

[Helm](https://helm.sh/) is a package manager for Kubernetes clusters, much like `apt` or `yum` on a traditional operating system, which can pull, download, deploy, and manage packaged workloads from a central repository, or from a local project.

A typical Helm chart will usually include all of the manifests one might typically manually apply individually with `kubectl` as templates, along with a `Values.yaml` file for quick management of user preferences, so it becomes a one-step process to manage all of these resources as a single resource.

A given package may include everything from `Deployment` resources, to `StorageClass` resources, to any set of Kubernetes resources.

Key benefits of Helm, the simplification of complex workloads aside, include the ability to version control the entire pipeline of YAML configs that might be required to deploy an application, as well as simplified update and rollback management.

## Setup

Helm will require:

- A Kubernetes cluster of any type, many of [our guides](https://www.packet.com/resources/guides/) cover options for choosing a cluster deployment.
- The [Helm client](https://v3.helm.sh/docs/intro/install/)

There are many central repositories for Helm packages one can install, Helm's maintainers offer one such repo for common software packages that can be installed as packages:

- [Helm Hub](https://hub.helm.sh/)

and if one is using Packet features in your Kubernetes clusters, the [Packet Helm Chart](https://github.com/packet-labs/helm-charts) repo is available as well.

On the machine running the Helm client, the `KUBECONFIG` environment variable must be set to the cluster config context for the target cluster, much like it would be for `kubectl` usage (the Kubernetes client is not required locally in order to use Helm).

## Installing a Chart

Much like a traditional package management system, to install a package from a remote source, one must add a `repo`:

```
helm repo add <repo name> https://<repo URL>
```

and `update`

```
helm repo update
```

before installing the package:

```
helm install <package name>
```


Helm can also install packages from a local source:

```
helm install <name> ./local-src-dir
```

with common optional flags like `--generate-name` to assign one automatically, or `--dry-run` to run through a deployment, and `--debug` to increase output verbosity.

Viewing your workloads and status can be done using `helm ls`.

## Creating a Chart

Bundling applications for use with Helm is a very quick process to begin:

```
helm create my-new-chart
```

and Helm will create a directory tree with sample templates, and Chart definition files:

```
» tree my-new-chart                                                                                                    
my-new-chart                                                                                                                                                                           
├── Chart.yaml                                                                                                                                                                         
├── charts                                                                                                                                                                             
├── templates                                                                                                                                                                          
│   ├── NOTES.txt                                                                                                                                                                      
│   ├── _helpers.tpl                                                                                                                                                                   
│   ├── deployment.yaml                                                                                                                                                                
│   ├── ingress.yaml                                                                                                                                                                   
│   ├── service.yaml                                                                                                                                                                   
│   ├── serviceaccount.yaml                                                                                                                                                            
│   └── tests                                                                                                                                                                          
│       └── test-connection.yaml                                                                                                                                                       
└── values.yaml   
```

All of the resources deployed with the application will go into `templates`. With a `Deployment` example like:

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.7.9
        ports:
        - containerPort: 80
```

and a `Service` like:

```
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
```

in the `Templates` directory, to install this package, Helm could be run using `helm install nginx-service ./my-new-chart`, however, Helm's templates also handle templating these resources to customize them based on the contents of the `values.yaml` file, where variables can be declared, and then substituted into these manifest templates, for example, adding `nginx-version: 1.7.9` to `values.yaml`, and then updating `templates/Deployment.yaml` to:

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
...
    spec:
      containers:
      - name: nginx
        image: nginx:{{ .Values.nginx-version }}
        ports:
        - containerPort: 80
```

for example. Helm templates also support conditionals, so if some condition is met the template that gets applied will change accordingly. For example, adding a variable like `private-application: "yes"` to `values.yaml`, and adding a condition like the following to `templates/Deployment.yaml`:

```
apiVersion: v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
{{ if eq .Values.private-application "yes" }}
    private: yes
{{ end }}
	app: nginx
...
```

to modify, in this case, the labels applied to this service.

Then, to apply this local chart, `helm install` will run as it might for any other package:

```
helm install --dry-run ./my-new-chart
```

## Plugins for Sensitive Data

Some applications require sensitive data, and the Kubernetes `Secret` resource is supported by Helm, but for encryption and decryption of these managed Secrets, Helm's plugin system allows developers to create tools like [futuresimple/helm-secrets](https://github.com/futuresimple/helm-secrets) to manage these resources a little more safelty.

Other plugins along this line include [technosophos/helm-keybase](https://github.com/technosophos/helm-keybase) to create secured repos, and [technosophos/helm-gpg](https://github.com/technosophos/helm-gpg) to verify and sign your charts, amongst others.

## Additional Resources

- [Helm Best Practices](https://v3.helm.sh/docs/topics/chart_best_practices/conventions/)
- [Chart Templating Guide](https://v3.helm.sh/docs/topics/chart_template_guide/builtin_objects/)
- [Helm Hub](https://hub.helm.sh)
- [Packet Helm Charts](https://github.com/packet-labs/helm-charts)
