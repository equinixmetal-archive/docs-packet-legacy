<!--<meta>
{
    "title":"SOS: Serial over SSH",
    "description":"Accesisng Serial Console (SOS)",
    "date": "09/20/2019",
    "tag":["SOS", "Console"]
}
</meta>-->

There are times when a server becomes unreachable over SSH due to broken networking, a bad install, misconfiguration, a kernel upgrade, bad firewall rules, etc.

If you have your server's root password and your SSH key, please follow the instructions below.  If you do not have these assets, you should [_leverage our Rescue Mode_](/products/servers/how-to-deploy/rescue-mode.md).

#### Using SOS for Out of Band Access

Packet offers an out of band access method that we call "SOS" - which stands for Serial Over SSH. In order to use SOS you will need your server's root password and valid SSH key.

#### Using SOS

`ssh {server-uuid}@sos.{facility-code}.packet.net`  

*   You can find the **{server-uuid}** on the server details section in our user portal.
*   For a full list of **{facility-code}** options (e.g. ewr1, sjc1, ams1, etc) see our [Data Centers](/products/common-questions/datacenters.md) article.
*   If you have multiple keys locally, use the`-i` flag to specifically choose the correct key.

  ````
  ssh 4df512fd-253f-428e-867f-9107a6c925fb@sos.ewr1.packet.net -i /path/to/correct/key
  ````

### Run it

Open up a terminal window and enter the command.

We don’t keep a persistent connection to the serial console on every server, so when you connect there won’t be any previous output.  You will likely need to press enter/return before it asks for username and password.

If you disconnected previously without logging out, you may already be logged in.

A few things to note:

*   This method allows only one connection at a time because our servers only have a single serial console. In the future, we plan to allow users to share the same console session.
*   If you try to connect to the console while the server is still provisioning, it will place you in a read-only mode until up to 30 seconds after the server has finished provisioning.
*   If you don't see any output after connecting to SOS (common when using a custom image, operating system, or iPXE) please ensure that you have your console settings setup correctly. For x86 servers, use `ttyS1,115200n8`. For aarch64 servers, use `ttyAMA0,115200`.

### Disconnect

In order to disconnect from the server you need to enter `~.` (tilde followed by period). SSH only accepts the escape character after a new line, so you may need to press enter/return first, followed by `~.` .

This method of disconnection is built into SSH, not part of our console service.
