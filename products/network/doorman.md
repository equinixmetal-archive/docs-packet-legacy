<!--<meta>
{
    "title":"Customer VPN: Doorman",
    "description":"Utilizing Doorman to access your Device",
    "date": "09/20/2019",
    "tag":["VPN", "Private Network", "Doorman"]
}
</meta>-->


# Doorman

### Enable Two Factor Authentication

In order to use the Doorman VPN service, you will need to have Two Factor Authentication \(2FA\) enabled via the Packet app. To enable 2FA, simply log in to the Packet Portal, then go to **'Settings'**=&gt; **'Security'** where you will find the option to enable 2FA under Set Up Using an App.

You can use your favorite 2FA app, as long as is supports Time-based One-time Password Algorithm \(TOTP\) which is an open standard. Example: Google Authenticator, Authy, Duo Security, should all work fine.

### Download OpenVPN Configuration Files

Once you have 2FA enabled, a new option will be visible, Packet Customer VPN.

After you turn it on, you will see the option to download the OpenVPN configuration files for each of Packet’s facilities.

![](https://deskpro-cloud.s3.amazonaws.com/files/26944/43/42266XXHJRRCSJXBQKPR0-1539835990437.png)

### Log in to the VPN

After downloading the config files, you can use them with your preferred app. The login credentials will be:

**Username:** _YOUR\_PACKET\_ACCOUNT\_EMAIL_

**Password:** _YOUR\_2FA\_TOKEN+YOUR\_PACKET\_ACCOUNT\_PASSWORD_

**Example:**

If the portal password is "_packet-rocks-2017_" and the 2-factor token you generate is "_123456_", when logging into the VPN, your password would be “_123456packet-rocks-2017_”.

Once the connection is successful, you will be able to ping your server’s Private IPs, as well as connect via SSH.

```text
ssh root@10.100.237.133 
Welcome to Ubuntu 16.04.1 LTS (GNU/Linux 4.4.0-47-generic x86_64) 
... 
root@vpn:~#
```

