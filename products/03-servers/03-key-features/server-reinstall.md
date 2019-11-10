<!--<meta>
{
    "title":"Reinstall",
    "description":"Learn more about reinstalling a server at Packet!",
    "date": "2019/11/5",
    "tag":["Reinstall", "Server"]
}
</meta>-->

### Server Reinstall


The Server Reinstall feature enables you to provision a new instance on the same hardware, which is perfect if you want to keep the assigned IP addresses, userdata, etc.  

Reinstalls take a little longer than a normal fresh provision, since the server has to go through a deprovision process first. During deprov, we bring the server back to a “ready state”, which involves wiping the disks, checking firmware, and other elements. As such, **a reinstall will fully wipe any data on the server**. After the the deprovision is complete, we’ll install the OS again through a normal provision, but using the same hardware and IP addresses assigned previously. 

Any Block storage volume needs to be properly detached, in order for it not to be impacted, but you will need to re-attach it once your server is re-installed.

You can find the reinstall feature via the device view page and under server actions. 

![device-reinstall](/images/device-reinstall/device-reinstall.png)


If API is your thing, you can do the following payload: 

```
curl -X POST -H 'X-Auth-Token: {token}' -H 'Content-Type: application/json' "https://api.packet.net/devices/{server_uuid}/actions" -d '{"type":"reinstall"}'
```
