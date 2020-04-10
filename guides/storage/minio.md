<!-- <meta>
{
    "title":"Object Storage with Minio",
    "description":"Deploy, Setup, & Configure Minio Object Storage Server",
    "tag":["S3", "Object Storage", "Minio"],
    "seo-title": "Object Storage with Minio - Packet Technical Guides",
    "seo-description": "Deploy, Setup, & Configure Minio Object Storage Server",
    "og-title": "Object Storage with Minios",
    "og-description": Deploy, Setup, & Configure Minio Object Storage Servert"
}
</meta> -->

MinIO is a high performance distributed object storage server, designed for large-scale private cloud infrastructure. MinIO is designed in a cloud-native manner to scale sustainably in multi-tenant environments. 


#### Installing & Configuring Minio 

You can install the Minio server by compiling the srouce code or via a binary file. For this guide, we will make use of the binary. 

If you haven't updated the package database recently, update it now: 

```
apt get update
```

Next, download the Minio server binary: 

```
curl -O https://dl.minio.io/server/minio/release/linux-amd64/minio
```

A file name will then be downloaded to the current working directory. You will need to change permissions of this file to become executable. 

```
chmod +x minio
```

Next the binary will need to be relocated to the `/usr/local/bin` directory where the startup script expects to find it. 

It is not suggested to run the Minio server as root. Instead, creating a user and it's group called `minio-user`. 

This is done by running: 

```
useradd -r minio-user -s /sbin/nologin
```

Dependent upon your particular setup, the creation of the storage directory may vary.

The directory in which you wish to Minio storage to reisde will need to have the permissions adjsted to permit the user `minio-user` access. 

```
chown minio-user:minio-user /path/to/storage
```

Next up, we will need to create Minios configuration file. Typically, the most common location for this configureation is found in `/etc/`

The location in which you choose will need to have the permission adjusted to permit the user `minio-user` access. 

An example of the Minio configuration: 

```
MINIO_VOLUMES="/usr/local/share/minio/"
MINIO_OPTS="-C /etc/minio --address your-server-ip:9000"
```

* MINIO_VOLUMES: is the directory (path) where your files will reside. 

* MINIO_OPTS: is the way in which you tell the Minio server to operate from particular IP address to a specific port. 


#### Minio Startup Script

The Minio Server will need a startup script created. The following steps will get that established. 

First up, down load the descrpitor file: 

```
curl -O https://raw.githubusercontent.com/minio/minio-service/master/linux-systemd/minio.service
````

Double check the contents of the file, to ensure it's content.  Once you are satisified with the content, the file will need to be moved to `/etc/systemd/system`. 

To ensure systemd knows of the new startup it is necessary to reload the systemd units: 

```
systemctl daemon-reload
```

To ensure the Minio Server automatically starts at reboot, add it to systemctl: 

```
systemctl enable minio
```

This completes the install, and setup process for Minio. You should now be able to start the service. 

```
systemctl start minio
```

Double check that is in fact running: 

```
systemctl status minio
```

You should see an opput similar to: 

```
 minio.service - MinIO
   Loaded: loaded (/etc/systemd/system/minio.service; enabled; vendor preset: enabled)
   Active: active (running) since Thu 2020-04-09 15:31:45 UTC; 1 day 3h ago
     Docs: https://docs.min.io
 Main PID: 2757 (minio)
    Tasks: 20 (limit: 4915)
   CGroup: /system.slice/minio.service
           └─2757 /usr/local/bin/minio server -C /etc/minio --address s3.example.com:443 /usr/local/minio/data
```



More information about Minio is available at the [project’s documentation website](https://docs.minio.io/) & information about how to secure your Minio Server with [Let's Encrypt certificates](https://docs.min.io/docs/generate-let-s-encypt-certificate-using-concert-for-minio.html). 