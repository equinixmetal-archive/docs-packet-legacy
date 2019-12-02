<!--<meta>
{
    "title":"Custom Images",
    "description":"Learn more about Building Your Own O.S. (Custom Images)",
    "tag":["Custom Images"]
}
</meta>-->

Packet leverages GitHub to transparently manage our officially supported Operating System images.  You can view the repos for each official image here.

In addition to providing a public change log, this process enables users to programmatically "pin" their installs to particular OS versions, improving the stability (dare we say immutability!) of your deployments.

Packet's official images are optimized for speed and therefore only have the minimum number of packages installed.

There are different use cases where the ability to deploy a custom image can reduce deployment time and streamline your workflow, especially in very active environments. While you can always install and remove packages (or adjust your kernel) after deploying an official Packet OS image, using a custom image can "front-load" these customization.  