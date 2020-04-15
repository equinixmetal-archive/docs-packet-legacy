<!-- <meta>
{
    "title": "Nvidia Drivers: x2.xlarge",
    "description": "Installing the official Nvidia drivers and CUDA toolkit for Ubuntu 16/18.04 on the x2 in Packet",
    "tag": ["nvidia", "x2.xlarge", "CUDA"],
    "seo-title": "x2.xlarge Nvidia Drivers Install - Packet Technical Guides",
    "seo-description": "x2.xlarge Nvidia Drivers",
    "og-title": "x2.xlarge Nvidia Drivers",
    "og-description": "This article describes the steps on installing the official Nvidia drivers and CUDA toolkit for Ubuntu 16.04 and 18.04 for x2 systems in Packet."
}
</meta> -->


Systems Requirements:


* CUDA-capable GPU
* Supported version of Linux with gcc compiler and toolchain
* NVIDIA CUDA Toolkit


### Pre-installation Actions

1. **Verify the system has a CUDA-capable GPU.**

    ```
    ~# lspci | grep -i nvidia
    d8:00.0 3D controller: NVIDIA Corporation GP104GL [Tesla P4] (rev a1)
    ```

    To install lspci, run:

    ```
    ~# apt-get install pciutils
    ```
    If you do not see any settings, update the PCI hardware database that Linux maintains   by entering `update-pciids` (generally found in /sbin or /usr/sbin) at the command line     and rerun the previous lspci command.

2. **Verify the system is running a supported version of Linux.**

    ```
    ~# uname -m && cat /etc/*release
    x86_64DISTRIB_ID=Ubuntu
    DISTRIB_RELEASE=16.04
    DISTRIB_CODENAME=xenial
    DISTRIB_DESCRIPTION="Ubuntu 16.04.5 LTS"
    NAME="Ubuntu"
    VERSION="16.04.5 LTS (Xenial Xerus)"
    ID=ubuntu
    ID_LIKE=debian
    PRETTY_NAME="Ubuntu 16.04.5 LTS"
    VERSION_ID="16.04"
    HOME_URL="http://www.ubuntu.com/"
    SUPPORT_URL="http://help.ubuntu.com/"
    BUG_REPORT_URL="http://bugs.launchpad.net/ubuntu"
    VERSION_CODENAME=xenial
    UBUNTU_CODENAME=xenial
    ```

3. **Verify the system has the correct kernel headers and development packages installed.**

    Below is the command to check the current kernel version the system is running.

    ```
    ~# uname -r
    ```

    The development packages and kernel headers are needed for the CUDA driver. It should match the running version of the kernel at the time of the driver installation, also whenever the driver is rebuilt. (Reference: CUDA Installation Guide Linux - 2.4 Verify System has Correct Kernel Headers and Development Packages Installed)

    Note: If system update is performed and changes made to the linux kernel version being used, make sure to re-run the commands below to ensure you have the kernel headers installed. Otherwise, the CUDA Driver will fail to work with the new kernel. (Reference: CUDA Installation Guide Linux - 2.4 Verify System has Correct Kernel Headers and Development Packages Installed).

    To install the development packages and kernel headers for the currently running kernel:

    ```
    ~# apt-get install build-essential
    ```
    ```
    ~# apt-get install linux-headers-$(uname -r)
    ```

4. **Verify the system has gcc installed.**

    ```
    ~# gcc --version
    ```

### Installation of Nvidia driver and CUDA from the official repo

1. **Install official repository.**

    Browse the repos depending on your operating system.
    https://developer.download.nvidia.com/compute/cuda/repos/

    **Note:** At the time of writing, the latest version is 10.0.130-1, but you may user other versions. The commands bellow will assume version 10.0.130-1 and Ubuntu 16.04.

    Download the cudo repo package:

    ```
    ~# wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu1604/x86_64/cuda-repo-ubuntu1604_10.0.130-1_amd64.deb
    ```

    Fetch the gpg keys for the repo:

    ```
    ~# apt-key adv --fetch-keys https://developer.download.nvidia.com/compute/cuda/repos/ubuntu1604/x86_64/7fa2af80.pub
    ```

    Then install:

    ```
    ~# dpkg -i cuda-repo-ubuntu1604_10.0.130-1_amd64.deb
    ```

    To check that the installation was successful, navigate to the /etc/source.list.d and check if there is repo list for CUDA.

    ```
    ~# ls -l /etc/apt/sources.list.d
    total 4
    -rw-r--r-- 1 root root 80 Nov 13 22:48 cuda.list
    ```
    ```
    ~# cat /etc/apt/sources.list.d/cuda.list
    deb http://developer.download.nvidia.com/compute/cuda/repos/ubuntu1604/x86_64
    ```

    Update apt cache,
    ```
    ~# apt-get update
    ```

2. Install the nvidia driver and the CUDA toolkit.

    ```
    apt-get install --no-install-recommends cuda
    ```
3. Reboot machine.

4. Once rebooted, double check if the nvidia driver has been loaded automatically.

    ```
    ~# lsmod | grep -i nvidia
    nvidia_uvm            790528  0
    nvidia_drm             45056  0
    nvidia_modeset       1040384  1 nvidia_drm
    nvidia              16592896  2 nvidia_modeset,nvidia_uvm
    ipmi_msghandler        49152  3 ipmi_ssif,nvidia,ipmi_si
    drm_kms_helper        155648  1 nvidia_drm
    drm                   364544  3 drm_kms_helper,nvidia_drm
    ```

5. Check nvidia  gpu and driver version.

    ```
    ~# nvidia-debugdump --list
    Found 1 NVIDIA devices
            Device ID:              0
            Device name:            Tesla P4
            GPU internal ID:        0421818006236
    ```
    ```
    ~# cat /proc/driver/nvidia/version
    NVRM version: NVIDIA UNIX x86_64 Kernel Module  410.79  Thu Nov 15 10:41:04 CST 2018
    GCC version:  gcc version 5.4.0 20160609 (Ubuntu 5.4.0-6ubuntu1~16.04.11)
    ```
    ```
    ~# nvidia-smi
    +-----------------------------------------------------------------------------+
    | NVIDIA-SMI 410.79       Driver Version: 410.79       CUDA Version: 10.0     |
    |-------------------------------+----------------------+----------------------+
    | GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
    | Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
    |===============================+======================+======================|
    |   0  Tesla P4            Off  | 00000000:D8:00.0 Off |                    0 |
    | N/A   37C    P0    23W /  75W |      0MiB /  7611MiB |      0%      Default |
    +-------------------------------+----------------------+----------------------+
    +-----------------------------------------------------------------------------+
    | Processes:                                                       GPU Memory |
    |  GPU       PID   Type   Process name                             Usage      |
    |=============================================================================|
    |  No running processes found                                                 |
    +-----------------------------------------------------------------------------+
    ```

6.  Check CUDA version.
    ```
    ~# nvcc -V
    nvcc: NVIDIA (R) Cuda compiler driverCopyright (c) 2005-2018 NVIDIA CorporationBuilt on Sat_Aug_25_21:08:01_CDT_2018Cuda compilation tools, release 10.0, V10.0.130
    ```

    **Note:** For Ubuntu 18.04 image for x2 system, the nouveau driver is integrated and loaded on boot automatically. Because of this it interferes with the loading of the official Nvidia driver (installed from above instruction).

    To unload nouveau, run the following command:
    ```
    ~# rmmod nouveau
    ```
    However, this will not prevent nouveau from loading on-boot.
