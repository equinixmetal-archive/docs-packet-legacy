# Extending Storage Volume
You may want to extend (grow) your storage volume if you are running low on disk space. This is currently an "Offline" operation which means you will need to unmount and detach your volume from your server. The safest way to do this by powering off the server that your volume is attached to. This is also currently an API only feature for the time being. Also, although a lot of the information below will be easily gatherable thought the Packet Portal, we'll be using the RestAPI for this procedure.

### Prerequisites
* We will be using [curl](https://curl.haxx.se/) and [jq](https://stedolan.github.io/jq/) in these examples, please ensure these are installed and working properly
* Ensure you have an API token, this can be generated in the Packet Portal by clicking the very top right drop down, and selecting "API Keys"

### Set your API token to a variable
```bash
TOKEN='aBc123dEf456gHi789jKl012mNo345pQ'
```

### Find your project id
```bash
curl https://api.packet.net/projects \
    -H "X-Auth-Token: $TOKEN" \
    -H 'Accept: application/json' | \
    jq '.projects[] | "\(.name)   ---   \(.id)"'
```
You will see output similar to:
```
"My best project  ---   80013314-9995-404d-b884-46650fce1510"
"My mediocre project   ---   794d20f6-bb54-4731-8ee0-6eda608de285"
"My worst project   ---   30fae166-93d2-4272-ba97-1a5b727a88ef"
```
The UUID off to the right (after `   ---   `) will be your project's id.
### Record your project's id into a variable
```bash
PROJECTID='794d20f6-bb54-4731-8ee0-6eda608de285'
```

### List all volumes in the project selected above
```bash
curl https://api.packet.net/projects/$PROJECTID/storage \
    -H "X-Auth-Token: $TOKEN" \
    -H 'Accept: application/json' | \
    jq '.volumes[] | "\(.description)   ---   \(.id)   ---   \(.attachments)"'
```
You will see output similar to:
```
"My best volume   ---   bea3d0be-37e2-4d61-a6d1-810d1a3d6dcc   ---   [{\"href\":\"/storage/attachments/49afcf99-52a8-4145-b29c-9e77ca9ac999\"}]"
"My mediocre volume   ---   3ae0102c-8b86-4e7e-be50-295e7ef51db8   ---   []"
"My worst volume   ---   36d04b29-9326-43a2-95e8-dafc656c075e   ---   [{\"href\":\"/storage/attachments/6369dc29-4930-4806-87fa-27f17b0558ee\"}]
```
What we want to do is detach the volume so that the last column looks like `[]` but currently it most likely has an attachment

### Record volume id and volume attachment to variables
```bash
VOLUMEID='bea3d0be-37e2-4d61-a6d1-810d1a3d6dcc'
VOLUMEATTACH='/storage/attachments/49afcf99-52a8-4145-b29c-9e77ca9ac999'
```
***Notice on the volume attach variable I started with `/storage` and ended before the `\"}]`***

### Detach the volume from the server
Make sure the server is powered off at this point (Or you are 100% sure your volume is unmounted properly though the Packet tooling.)
```bash
curl -X DELETE https://api.packet.net$VOLUMEATTACH \
    -H "X-Auth-Token: $TOKEN" \
    -H 'Accept: application/json'
```
This API call will return zero output if all has been done properly.

### Double check volume attachments
```bash
curl https://api.packet.net/projects/$PROJECTID/storage \
    -H "X-Auth-Token: $TOKEN" \
    -H 'Accept: application/json' | \
    jq '.volumes[] | "\(.description)   ---   \(.id)   ---   \(.attachments)"'
```
You should now see `[]` next to the volume we want to resize

### Resize volume
Set the size of the volume you want to a variable (This must be larger than the current volume size)
```bash
SIZE=150
```
Resize the volume
```bash
curl -X PUT https://api.packet.net/storage/$VOLUMEID \
    -H "X-Auth-Token: $TOKEN" \
    -H 'Accept: application/json' \
    -H 'Content-Type: application/json' \
    -d "{\"size\": $SIZE}" | \
    jq .
```
That should have outputted all of the volume info with it's new size!

### Record the ID of the server you want to reattach the volume to
```bash
curl https://api.packet.net/projects/$PROJECTID/devices \
    -H "X-Auth-Token: $TOKEN" \
    -H 'Accept: application/json' | \
    jq '.devices[] | "\(.hostname)   ---   \(.id)"'
```
You should see output similar to:
```
"My best server   ---   2ae00ba1-76e3-4666-b7af-6a14c8b535bb"
"My mediocre server   ---   e5c006d3-793b-4964-8976-58de847812f4"
"My worst server   ---   46d0aa29-19be-4af9-bdd4-146f8c8030a6"
```

### Record the server id to a variable
```bash
SERVERID='2ae00ba1-76e3-4666-b7af-6a14c8b535bb'
```
### Reattach your volume
```bash 
curl -X POST https://api.packet.net/storage/$VOLUMEID/attachments \
    -H "X-Auth-Token: $TOKEN" \
    -H 'Accept: application/json' \
    -H 'Content-Type: application/json' \
    -d "{\"device_id\": \"$SERVERID\"}" | \
    jq .
```

### We're all done!
You can now power your server back online or remount your volume. At this point you will need to resize your filesystem, but that is out of scope for this article. 
