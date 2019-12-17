<!-- <meta>
{
    "title":"Docker",
    "slug":"docker",
    "description":"A Docker Machine driver from Packet",
    "author":"Zalkar Ziiaidin",
    "github":"zalkar-z",
    "date": "2019/12/11",
    "tag":["Docker", "Driver"]
}
</meta> -->

You can provision bare-metal hosts once you have built and installed the docker-machine driver. The binary will be placed in your `$PATH` directory.

Test that the installation worked by typing in:

```
$ docker-machine create --driver packet
```

## Building

Pre-reqs: `docker-machine` and `make`

- Install the Golang SDK [https://golang.org/dl/](https://golang.org/dl/) (at least 1.11 required for [modules](https://github.com/golang/go/wiki/Modules) support

- Download the source-code with `git clone http://github.com/packethost/docker-machine-driver-packet.git`

- Build and install the driver:

    ```
    $ cd docker-machine-driver-packet
    $ make 
    $ sudo make install
    ```

Now you will now be able to specify a `-driver` of `packet` to `docker-machine` commands.