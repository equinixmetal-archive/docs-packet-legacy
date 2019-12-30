<!--
<meta>
{
    "title":"NVME Flash Drives",
    "description":"How to Setup NVME flash drives.",
    "tag":["NVME", "flash", "drive"]
}
</meta>
-->
Packet's c1.xlarge.x86 server configuration includes 2 x 800GB NVMe drives, which are PCI-e attached flash cards.

With this new drive type, some of your common Linux disk utilities may have trouble recognizing the cards. Specifically, fdisk has limitations around GPT and doesn't show the latest NVMe drives. As such, Packet recommends using GNU parted to partition the NVMe drives.

We have provided some example commands below to get you started using these awesome, high-performance flash cards. The drives should show up as nvme0n1 and nvme1n1.

Example: Create a Single Large EXT4 Partition with GPT Label on nvme0n1

```
~# lsblk
NAME    MAJ:MIN    RM    SIZE    RO    TYPE    MOUNTPOINT
sda       8:0       0  111.8G     0    disk
├─sda1    8:1       0     94M     0    part
│ └─md0   9:0       0   93.9M     0    raid1   /boot
├─sda2    8:2       0      1K     0    part
├─sda5    8:5       0    1.9G     0    part
│ └─md1   9:1       0    1.9G     0    raid1   [SWAP]
└─sda6    8:6       0  109.8G     0    par
  └─md2   9:2       0  109.7G     0    raid1   /
sdb       8:16      0  111.8G     0    disk
├─sdb1    8:17      0     94M     0    part
│ └─md0   9:0       0   93.9M     0    raid1   /boot
├─sdb2    8:18      0      1K     0    part
├─sdb5    8:21      0    1.9G     0    part
│ └─md1   9:1       0    1.9G     0    raid1   [SWAP]
└─sdb6    8:22      0  109.8G     0    part
  └─md2   9:2       0  109.7G     0    raid1   /
nvme0n1 259:0       0  745.2G     0    disk
nvme1n1 259:1       0  745.2G     0    disk
```

Use parted  to create a new GPT partition table on the first disk.

root@ub14-test1:~# parted -a optimal /dev/nvme0n1 mklabel gpt
Warning: The existing disk label on /dev/nvme0n1 will be destroyed and all data on this disk will be lost. Do you want to continue? Yes/No? Yes
Information: You may need to update /etc/fstab.

Now create a new ext4 partition,

```
~# parted -a optimal /dev/nvme0n1 mkpart primary ext4 0% 100%
Information: You may need to update /etc/fstab.
root@ub14-test1:~# parted /dev/nvme0n1
GNU Parted 2.3
Using /dev/nvme0n1
Welcome to GNU Parted! Type 'help' to view a list of commands.
(parted) print
Model: Unknown (unknown)
Disk /dev/nvme0n1: 800GB
Sector size (logical/physical): 512B/512B
Partition Table: gpt
Number Start End Size File system Name Flags
1 1049kB 800GB 800GB primary
(parted) quit
```

and create an ext4 filling system.

```
~# mkfs.ext4 /dev/nvme0n1p1
mke2fs 1.42.9 (4-Feb-2014)
Discarding device blocks: done
Filesystem label=
OS type: Linux
Block size=4096 (log=2)
Fragment size=4096 (log=2)
Stride=0 blocks, Stripe width=0 blocks 48840704 inodes, 195353046 blocks 9767652 blocks (5.00%) reserved for the super user
First data block=0
Maximum filesystem blocks=4294967296 5962 block groups 32768 blocks per group, 32768 fragments per group 8192 inodes per group
Superblock backups stored on blocks:32768, 98304, 163840, 229376, 294912, 819200, 884736, 1605632, 2654208, 4096000, 7962624, 11239424, 20480000, 23887872, 71663616, 78675968, 102400000
Allocating group tables: done
Writing inode tables: done
Creating journal (32768 blocks): done
Writing superblocks and filesystem accounting information: done
```
```
~# mount /dev/nvme0n1p1 /mnt/drive -t ext4
```
```
~# mount | grep nvme
/dev/nvme0n1 on /mnt/drive type ext4 (rw)
```

I order to make the new volume persistent you will need to update `/etc/fstab`  with the drives UUID. Running cat on fstab will inform you the blkid command can be used to get a list of UUIDs for your devices.

```
~# blkid
/dev/nvme0n1: PTUUID="316bf358-35ff-4e6f-ae87-9a4fcb5e68b3" PTTYPE="gpt"
/dev/nvme0n1p1: UUID="04462c9d-a04d-4ced-9e20-6b02c212563b" TYPE="ext4" PARTLABEL="primary"
```

Once you have the correct UUID, use `nano` to add it to your `fstab` file.
