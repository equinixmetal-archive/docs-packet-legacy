<!--<meta>
{
    "title":"Custom Images",
    "description":"Learn more about Building Your Own O.S. (Custom Images)",
    "date": "09/20/2019",
    "tag":["Custom Images"]
}
</meta>-->

### Official Images
Packet leverages GitHub to transparently manage our officially supported Operating System images.  You can view the repos for each official image here.

In addition to providing a public change log, this process enables users to programmatically "pin" their installs to particular OS versions, improving the stability (dare we say immutability!) of your deployments.


### Why Use a Custom Image?
Packet's official images are optimized for speed and therefore only have the minimum number of packages installed.

There are different use cases where the ability to deploy a custom image can reduce deployment time and streamline your workflow, especially in very active environments. While you can always install and remove packages (or adjust your kernel) after deploying an official Packet OS image, using a custom image can "front-load" these customization.  



### Building a Custom Image
In this example, we will build a custom Ubuntu 16.04 image for use on a c1.small server.

Prerequisites: This assumes you have an active GitHub/Lab account. Also, the following packages are required to proceed.

* git-lfs: `apt get install git-lfs`  
* get-ubuntu-image:  
  ```
  wget https://raw.githubusercontent.com/packethost/packet-images/master/tools/get-ubuntu-image
  ```
* make get-ubuntu-image executable: `chmod +x /path/to/file`
* packet-save2image:
  ```
  wget https://raw.githubusercontent.com/packethost/packet-images/master/tools/packet-save2image
  ```
* set packet-save2image to executable: `chmod +x /path/to/file`  
* initrd.tar.gz
  ```
  wget https://github.com/packethost/packet-images/raw/ubuntu_16_04-c1.small.x86/initrd.tar.gz`  
  ```
* kernel.tar.gz:   
  ```
  wget https://github.com/packethost/packet-images/raw/ubuntu_16_04-c1.small.x86/kernel.tar.gz  
  ```
* modules.tar.gz:  
  ```
  wget https://github.com/packethost/packet-images/raw/ubuntu_16_04-c1.small.x86/modules.tar.gz
  ```
* DockerFile:  
  ```
  wget https://raw.githubusercontent.com/packethost/packet-images/ubuntu_16_04-base/x86_64/Dockerfile  
  ```
With the prerequisites out of the way, it's time to begin building the custom image.

In the Dockerfile, you are welcome to add/remove packages as you see fit. In this example though, we've added an additional RUN command, to prove that our example worked!

RUN echo "hello world" > /root/helloworld

**Download Image:**  
`./get-ubuntu-image 16.04 x86_64 .`

**Build:**  
`docker build -t custom-ubuntu-16 .`

**Save:**  
`docker save custom-ubuntu-16 > custom-ubuntu-16.tar`

**Package:**  
`sudo ./packet-save2image < custom-ubuntu-16.tar > image.tar.gz`

The packet-save2image script needs root privileges, so must be run with `sudo`, if you are not the root user.

️Please Note: custom-ubuntu-16 is the example name, please name your image as you see fit.

**Cleanup:**  
Once you have saved the image with packet-save2image  you can do some clean up in the specific directory where the custom image files reside, the following is an example:

```
rm SHA256SUMS*
rm ubuntu-base-16.04.4-base-amd64.tar.gz
rm rootfs.tar.gz rm custom-ubuntu-16.tar
rm get-ubuntu-image packet-save2image
```

Track, add, commit, and push your custom image to your repo

```
git lfs track *.tar.gz
git add Dockerfile .gitattributes image.tar.gz initrd.tar.gz  kernel.tar.gz  modules.tar.gz
git commit -m "Custom Ubuntu Image"
git push origin {your-repo}
```

Deploying Your Custom Image
Now that you've created your custom image, you can deploy it by specifying the repo and image tag via UserData at the time of deployment:

```
#cloud-config
#image_repo=https://somegitserver/user/image-repo.git
#image_tag=b1ce89c2584b9fe1513ec72a481fd1c662db6808
```

️The image_repo is the clone link of your github/lab repository, and the image tag should be the ID of your last git commit.

In the portal you'll add the UserData using the "options" slide out.

![deploy server](/images/custom-images/Deploy-Custom-Image-1.png)
![add userdata](/images/custom-images/Deploy-Custom-Image-2.png)
