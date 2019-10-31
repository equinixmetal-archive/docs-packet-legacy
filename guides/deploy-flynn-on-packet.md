<!--
<meta>
{
    "title":"Deploy Flynn on Packet",
    "description":"Deploy Flynn on Packet",
    "author":"Zalkar Ziiaidin",
    "github":"zalkar-z",
    "date": "2019/09/05",
    "email":"zak@packet.com",
    "tag":["Flynn"]
}
</meta>
-->

Deploy Flynn on Packet

In this guide we'll walk you through the basics of why you'd want a platform, how to install [Flynn](https://flynn.io/) on Packet, and the basics of deploying your apps and managing databases.

## Why Use a Platform?

Platforms do most of the work of operating your software for you so you can focus on building and improving your applications. A good platform will help you move faster, do more with a smaller team, and better utilize your servers.

There are lots of tools that help with deploying apps, creating and managing containers, virtual machines, networking, database configurations, and scheduling jobs. What sets platforms apart is they offer a complete stack out of the box, so you don't need to learn or configure dozens of tools. You get everything you need for modern devops practices so you can spend time building your own apps rather than building or maintaining infrastructure.  

While there are a zillion options, one of our favorites is Flynn—it's modern, opinionated, and super scalable.   Want to watch a video version of this guide? Click [here](https://flynn.io/apps).

## Key Benefit: High Availability

When you run a cluster of three or more servers, Flynn automatically sets everything up to be highly available. This means that if a server goes down, your apps and all of Flynn's components will recover immediately and keep on working on the remaining servers.

## Getting Started

Start installing Flynn by provisioning one or 3+ new servers on Packet to be the servers in your Flynn cluster. They should all be the same type, running Ubuntu 16.04 LTS, and in the same datacenter.

You will also need a Internet-accessible domain name for the cluster (it can be a subdomain) and DNS hosting provider for the domain. For this text we will use an example domain: demo.packetflynn.com.

## The Technical Tidbits

Once the servers are up and running, SSH in and set up a firewall to block all external access to the servers with the exception of ports 80, 443, and 22.

Here's an example of how to do that on Packet servers with iptables:

```bash
apt-get install -y iptables-persistent
iptables -F INPUT
ip6tables -F INPUT
iptables -A INPUT -s $ip -j ACCEPT // $ip is your host's public IPv4 address
iptables -A INPUT -i bond0 -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
ip6tables -A INPUT -i bond0 -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
iptables -A INPUT -i bond0 -p tcp --dport 80 -j ACCEPT
ip6tables -A INPUT -i bond0 -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -i bond0 -p tcp --dport 443 -j ACCEPT
ip6tables -A INPUT -i bond0 -p tcp --dport 443 -j ACCEPT
iptables -A INPUT -i bond0 -p tcp --dport 22 -j ACCEPT
ip6tables -A INPUT -i bond0 -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -s $nodeip -j ACCEPT // $nodeip is your other node's public IPv4 address (insert another line if you have 2 or more nodes)
iptables -A INPUT -i bond0 -p icmp --icmp-type echo-request -j ACCEPT
ip6tables -A INPUT -i bond0 -p ipv6-icmp -j ACCEPT
ip6tables -A INPUT -i bond0 -j DROP
netfilter-persistent save
```

## Install Flynn and Flynn CLI

Once the firewall is running and your iptable rules are in place, you may start to setup your Flynn cluster. First, install flynn on all your nodes by running this command:

```bash
$ curl -fsSL -o /tmp/install-flynn https://dl.flynn.io/install-flynn
$ bash /tmp/install-flynn
```

_Note: if you made some mistake with your installation you can always execute:_

```bash
$ bash /tmp/install-flynn --clean
```

this command will clean all your installation and deploy fresh.

After Flynn is installed you need to generate a discovery token on your primary node as identifier for the other nodes in your cluster. In our example, we have the minimum cluster size which is 3 nodes.

```bash
$ sudo flynn-host init --init-discovery https://discovery.flynn.io/clusters/0219abee-4964-404d-bfbf-cd9d7b5c389f
```

Once we have generated the discovery token on the first/primary node, let's apply it to the nodes we have in the cluster:

```bash
$ sudo flynn-host init --discovery https://discovery.flynn.io/clusters/0219abee-4964-404d-bfbf-cd9d7b5c389f
```

_Note: The above example is not applicable if you are running a single node Flynn instance._

Then you may start the Flynn daemon on all servers and ensure that all nodes are free from errors.

```bash
$ sudo systemctl start flynn-host
$ sudo systemctl status flynn-host
```

Now that we have a Flynn host running on all these 3 servers. We need to boostrap the cluster with flynn-host bootsrap command. But first, we need to make sure that we have a resolvable domain (or subdomain) with DNS A records pointing to all 3 nodes IP address, and a wildcard domain that is CNAME to the cluster domain.

e.g.

```bash
demo.packetflynn.com.   A     147.75.106.79
demo.packetflynn.com.   A     147.75.64.19
demo.packetflynn.com.   A     147.75.64.21
*.demo.packetflynn.com. CNAME demo.packetflynn.com.
```

Once we have the proper DNS, we bootstrap the Flynn cluster.

```bash
$ sudo CLUSTER_DOMAIN=demo.packetflynn.com flynn-host bootstrap --min-hosts 3 --discover https://discovery.flynn.io/clusters/0219abee-4964-404d-bfbf-cd9d7b5c389f
```

CLUSTER_DOMAIN is your domain (or subdomain) assigned to your Flynn cluster, you can also specify the number of nodes that you have in the cluster (--min-hosts) which we have 3 and lastly, the discovery token that you have generated earlier.

_Note: You only need to run this on your primary node in the cluster. It will schedule jobs on nodes across the cluster as required._

After Bootstrap you should see this message:

```bash
Flynn bootstrapping complete. Install the Flynn CLI (see https://flynn.io/docs/cli for instructions) and paste the line below into a terminal window:
```

To install the CLI paste this command into your terminal:

```bash
L=/usr/local/bin/flynn && curl -sSL -A "`uname -sp`" https://dl.flynn.io/cli | zcat >$L $$ chmod +x $L
```

Then you may add your cluster with the command printed after bootstrapping:

```bash
flynn cluster add -p [tls pin] [cluster name] [controller domain] [controller key]
```

The built-in dashboard can be accessed at http://dashboard.demo.packetflynn.com

When you access the dashboard, you will need to install the certificate in your browser before you can proceed and navigate through the other functions. You can refer to the screenshots below on how to install the SSL certificate in your browser, or just simply follow the guide shown in the Flynn dashboard.

![](/media/images/mQ7F-dashboard1.png)

![](/media/images/0wYs-dashboard2.png)![](/media/images/Z810-dashboard3.png)

The flynn dashboard will now prompt for your login token, which you can find with the following command:

```bash
flynn -a dashboard env get LOGIN_TOKEN
```

_Note: You should safe keep the login token generated in the message given above as it will serve as your access to the Dashboard._

## Deploying Your First App

Once you have everything setup, you should be ready to deploy your first test app! There are a lot of samples from the repo, but for this particular guide, we will use Go.

Flynn Example Repo: [https://github.com/flynn-examples/](https://github.com/flynn-examples/)

Start by cloning the app from GitHub:

```bash
$ git clone https://github.com/flynn-examples/go-flynn-example
```

This is a Go example application that starts a HTTP server and talks to a database.

Go to the cloned repository:

```bash
$ cd go-flynn-example
```

First, you will need to create your app. You can do this by running this command:

```bash
$ flynn create example
Created example
I've set the app name as example.
```

The command should also add a Flynn Git Remote, you can verify this by running:

```bash
$ git remote -v
flynn  https://git.demo.packetflynn.com/example.git       (fetch)
flynn  https://git.demo.packetflynn.com/example.git       (push)
origin https://github.com/flynn-examples/go-flynn-example (fetch)
origin https://github.com/flynn-examples/go-flynn-example (push)
```

The app uses Postgres as database, so we will add it:

_Note: this command must be run from ~/go-flynn-example/, or the app must be specified with flynn -a [app_name]._

```bash
$ flynn resource add postgres
Created resource 320f38ba-36bc-40ce-97e5-dad1b5c3bd20 and release c7b793ca-b7b1-4da0-bd1d-4ed95c1b52e8.
```

You should be able to see the database configuration when you run:

```bash
$ flynn env
DATABASE_URL=postgres://84abab8e4000453fe2e1ce3f4f04392a:80f9191af9ae6c7890e4caae54990255@leader.postgres.discoverd:5432/7f02ee75fe57cb70fe1e5d9afc37935c
FLYNN_POSTGRES=postgres
PGDATABASE=7f02ee75fe57cb70fe1e5d9afc37935c
PGHOST=leader.postgres.discoverd
PGPASSWORD=80f9191af9ae6c7890e4caae54990255
PGUSER=84abab8e4000453fe2e1ce3f4f04392a
```

Push the flynn Git remote to deploy the application:

```bash
$ git push flynn master
Counting objects: 728, done.
Delta compression using up to 8 threads.
Compressing objects: 100% (451/451), done.
Writing objects: 100% (728/728), 933.29 KiB | 0 bytes/s, done.
Total 728 (delta 215), reused 728 (delta 215)
-----> Building example...
-----> Go app detected
-----> Checking Godeps/Godeps.json file.
-----> Installing go1.6.3... done
-----> Running: go install -v -tags heroku .
-----> Discovering process types
       Procfile declares types -> web
-----> Compiled slug size is 3.6M
-----> Creating release...
=====> Scaling initial release to web=1
-----> Waiting for initial web job to start...
=====> Initial web job started
=====> Application deployed
To https://demo.packetflynn.com/example.git
 * [new branch]      master -> master
```

Now that the application is deployed, you can make HTTP requests to it using the default route for the application:

```bash
$ curl http://example.demo.packetflynn.com
Hello from Flynn using Packet bare-metal on port 8080 from container ddc97c7e-19a5-4033-8253-f0a337b20a0e
Hits = 2
```

OR

You can open this to any browser using the default route for the app:

![](/media/images/cWJG-dashboard4.png)

At this point, you may now use the Dashboard to manage your app. The sample screenshot below display the application that we have deployed:

![](/media/images/N3fb-dashboard5.png)

## Scaling Up

Applications declare their process types in a Procfile in the root directory. For example, you may have a web process type that serves HTTP traffic, and a worker type that handles background jobs.

This application declares a single web process type which executes go-flynn-example:

```apache
$ cat Procfile
web: go-flynn-example
```

New applications with a web process type are initially scaled to run one web process, as can be seen with the ps command:

```bash
$ flynn ps
ID                                          TYPE  STATE  CREATED             RELEASE                               COMMAND
flynn-db0440f7-19b4-4369-b79e-7a48dba415c2  web   up     About a minute ago  ccd1aa34-77f7-4b7c-9772-e5d39a9f2d1e  /runner/init start web
```

We can increase the number of web processes using the scale command:

```bash
$ flynn scale web=3
scaling web: 1=>3

09:33:51.730 ==> web 4ef91e4b-d0c3-4e3f-931b-6db3b551dcd9 pending
09:33:51.733 ==> web ccd3aff7-80b3-46b4-a95f-006bfceb80c6 pending
09:33:51.743 ==> web flynn-ccd3aff7-80b3-46b4-a95f-006bfceb80c6 starting
09:33:51.751 ==> web flynn-4ef91e4b-d0c3-4e3f-931b-6db3b551dcd9 starting
09:33:52.129 ==> web flynn-4ef91e4b-d0c3-4e3f-931b-6db3b551dcd9 up
09:33:52.171 ==> web flynn-ccd3aff7-80b3-46b4-a95f-006bfceb80c6 up

scale completed in 464.957638ms
```

ps should now show three running processes:

```bash
$ flynn ps
ID                                          TYPE  STATE  CREATED         RELEASE                               COMMAND
flynn-db0440f7-19b4-4369-b79e-7a48dba415c2  web   up     2 minutes ago   ccd1aa34-77f7-4b7c-9772-e5d39a9f2d1e  /runner/init start web
flynn-4ef91e4b-d0c3-4e3f-931b-6db3b551dcd9  web   up     16 seconds ago  ccd1aa34-77f7-4b7c-9772-e5d39a9f2d1e  /runner/init start web
flynn-ccd3aff7-80b3-46b4-a95f-006bfceb80c6  web   up     16 seconds ago  ccd1aa34-77f7-4b7c-9772-e5d39a9f2d1e  /runner/init start web
```

Repeated HTTP requests should show that the requests are load balanced across those processes and talk to the database:

```bash
$ curl http://example.demo.packetflynn.com
Hello from Flynn on port 8080 from container db0440f7-19b4-4369-b79e-7a48dba415c2
Hits = 2

$ curl http://example.demo.packetflynn.com
Hello from Flynn on port 8080 from container 4ef91e4b-d0c3-4e3f-931b-6db3b551dcd9
Hits = 3

$ curl http://example.demo.packetflynn.com
Hello from Flynn on port 8080 from container ccd3aff7-80b3-46b4-a95f-006bfceb80c6
Hits = 4

$ curl http://example.demo.packetflynn.com
Hello from Flynn on port 8080 from container 4ef91e4b-d0c3-4e3f-931b-6db3b551dcd9
Hits = 5
```

You can view the logs (the stdout/stderr streams) of all processes running in the app using the log command:

```bash
$ flynn log
2016-07-26T13:32:05.987763Z app[web.flynn-db0440f7-19b4-4369-b79e-7a48dba415c2]: hitcounter listening on port 8080
2016-07-26T13:33:52.370073Z app[web.flynn-4ef91e4b-d0c3-4e3f-931b-6db3b551dcd9]: hitcounter listening on port 8080
2016-07-26T13:33:52.402620Z app[web.flynn-ccd3aff7-80b3-46b4-a95f-006bfceb80c6]: hitcounter listening on port 8080
```

## Backup and Restore

To take a full-cluster backup, run flynn cluster backup --file backup.tar. This will create a file named backup.tar with a complete copy of all apps and databases.

You can restore to a new cluster using the backup file. Just follow the manual installation instructions and modify the flynn-host bootstrap command to include an extra flag: --from-backup backup.tar

Learn more about how to use and operate Flynn at [https://flynn.io/docs](https://flynn.io/docs)
