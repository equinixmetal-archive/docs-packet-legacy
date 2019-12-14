<!--
<meta>
{
    "title":"User State",
    "description":"Leverage 'user state' options to inform the Packet API about custom provisioning events.",
    "tag":["user", "state"]
}
</meta>
-->
With user state, you can programmatically inform the Packet API when userland operations have started, completed, or failed.  You can also view & query that information later.  

* __Question:__ What's userland?
* __Answer:__ Anything running in the host OS after install.

### Background - When Active Doesn't Mean Active
Usually when our system reports that a server is "Active" it means that a provision has finished and you can ping/ssh into that server.  However, this isn't always the case with Custom iPXE installs or when you install a customized version of one of our base images (details).

When the provisioning system detects any of these two custom installation types, it will set the provision as "Active" very early in the process - basically once we are done with our part and begin installing the provided image.  

However, this "Active" state can be a bit misleading, as there is usually work still ongoing (such as installing your custom image!). This is where you can leverage a custom "user state" option to gain better control over the process.

### Custom User State for Managing User Data
Another way to use this feature is when you leverage a lot of user-data during a normal installation. This can get bulky, and long running user-data leaves you a bit in the dark as to the state of your provision.

With our User State feature, you can see when the user-data install actually begins, and when it finishes.  

### How to Create a Custom User State
We support passing a specific user state to our API, but this has to happen from within the device itself.    

* Get the Phone Home IP: First, from a device, get the phone-home IP address by querying our metadata service for the phone_home_url.  (hint: you might want to install and use jq in order to help automate this).  
```
curl https://metadata.packet.net/metadata | jq -r .phone_home_url
http://147.75.195.231/phone-home
```

* Post a Custom User State: If you want to send a custom user state, you should POST a request to that IP on the /events URL. This will add an event to the device's timeline and also display a message in the portal.  
```
curl -X POST -d '{"state":"running","code":1007,"message":"Whoops"}'
http://147.75.195.231/events
```
This allows you to see the custom user state event on the device timeline and device detail page:

* Indicate Success: You'll want to finish things off by communicating a successful install, changing the state to succeeded and maybe adding a cool message there.  
```
curl -X POST -d '{"state":"succeeded","code":1099,"message":"I am ready now!!!"}' http://147.75.195.231/events
```

### Available Options
The POST request can accept the following data options:

* state (running, succeeded, or failed)
* code (anything between 1000 and 1099, inclusive)
* message (can be anything you want!)
