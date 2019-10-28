<!--
<meta>
{
    "title":"Apache Kafka on CoreOS",
    "description":"Setup Kafka cluster on a single Packet bare-metal machine",
    "author":"Zak",
    "github":"zalkar-z",
    "date": "2019/09/05",
    "email":"zak@packet.com",
    "tag":["apache", "kafka", "coreOS]
}
</meta>
-->

Apache Kafka on CoreOS

# Introduction

In this article I'll walk you through a quick and easy way of setting up a Kafka cluster on a single Packet bare-metal machine. The entire setup will have the default Zookeeper instance that ships with Kafka, and three message brokers. I'll show you how to do a dry-run as well the process for publishing some messages to the Producer and receiving them via Consumer.

If your application is collecting, streaming or measuring a large volume of events, then you've probably heard of [Kafka](http://kafka.apache.org/).  Now an Apache project, Kafka was originally created at LinkedIn to solve their need for highly scalable, low latency message brokering service (although you could also call it a pub/sub system or a really good queuing solution).

Written in Scala, the application has evolved significantly since graduating into the formal Apache foundation in late 2012.  It's now a popular alternative to other message brokers like ActiveMQ, mainly due to its speed and reliability, even at huge volumes.

At Packet, we love learning about new technologies or helping to dig up solutions to challenges that our clients face.  The best part of my job is that I get paid to touch all kinds of different deployed technologies and help automate them on super fast bare metal machines (like our Type 3 server and it's NVMe flash cards!).  It's a bit like putting a geeky kid in an "ops focused" candy store!

Recently I stumbled across a [LinkedIn](https://engineering.linkedin.com/kafka/benchmarking-apache-kafka-2-million-writes-second-three-cheap-machines) article where they conducted some benchmarking performance on Kafka, getting up to 2 million writes per second on 3 machines.  Crazy!  I had to check Kafka out further and see how we could make it super easy to deploy on Packet.

# Getting Started

So let's get started...first manually and then using some nice cloud-init YAML for automation.

I've chosen to install a bare metal Type 1 machine, which includes a quad core processor, 16GB of RAM and 2 x 120GB enterprise SSD drives for $0.40/hr.  I'll use CoreOS Stable, as it is really awesome for cluster automation.

# Setting up a Single Broker

### Step 1

First, we need to download kafka and untar it from your root directory.  Hop on to your Packet server using your SSH private key and logging in as root.  First, download the latest kafka stable release [here](http://kafka.apache.org/downloads.html).  Then, let's extract it:

```
# tar -xzf kafka_2.10-0.8.2.0.tgz cd kafka_2.10-0.8.2.0/
```

We also need to make sure that we have a Java runtime environment installed so that we can run Kafka and Zookeeper. We can use the default JRE that is available from the local repository:

```
# apt-get install default-jre
```

### Step 2

Next, let's setup Zookeeper. Why Zookeeper? Imagine, herding a sheep without a shepherd? Zookeeper plays a vital part in coordinating nodes in a Kafka cluster.  For the same reason why it is described as "a centralized service for maintaining configuration information, naming, providing distributed synchronization, and providing group services".

Good thing is, I'm demonstrating a quick and easy way to deploy Kafka cluster on a single bare-metal machine. So, we can just use the default Zookeeper config that ships with Kafka and get right on to running some Kafka tests.  So head into your Kafka directory (/root/kafka_2.10-0.8.2.0/) and run:

```
# bin/zookeeper-server-start.sh config/zookeeper.properties
```

Keep in mind that Zookeeper runs by default on TCP port 2181.  Now that we have Zookeeper running, we can start the Kafka server by invoking this command inside kafka_2.10-0.8.2.0/ directory:

```
# bin/kafka-server-start.sh config/server.properties
```

### Step 3

Once both Zookeeper and Kafka are up and running, we need to create a sample Topic so we can run some tests.  Topics are basically a grouping of messages in Kafka's data model.  I'll  setup a Topic called "TestRun" by running the following command:

```
# bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic TestRun
```

To check the topic that we just created, you can run a list, as follows:

```
# bin/kafka-topics.sh --list --zookeeper localhost:2181
```

### Step 4

Then, we need to try and send some messages by starting and running the Producer:

```
# bin/kafka-console-producer.sh --broker-list localhost:9092 --topic TestRun

Hello World

Hello World 123
```

### Step 5

Lastly, let's run a Consumer so we can see the messages published by the Producer:

```
# bin/kafka-console-consumer.sh --zookeeper localhost:2181 --topic test --from-beginning
```

The output we should see after running the command above are the messages that we published when we ran the Producer (Hello World and Hello World 123).

# Part 2 - Running Two or More Brokers in a Cluster

Now that Kafka and Zookeeper are running, we will try to setup three brokers. Three brokers is better than one, right? and hey! it's not a cluster if we are running a single instance, correct? plus it's more fun! so let's begin.

First, we need to create a config file for each brokers:

`config/server.properties config/server-1.properties<br>
config/server.properties config/server-2.properties`

Then we need to edit each (newly created) config files and update the following:

```
config/server-1.properties:

&#xA0; &#xA0; broker.id=1

&#xA0; &#xA0; port=9093

&#xA0; &#xA0; log.dir=/tmp/kafka-logs-1

&#xA0;

config/server-2.properties:

&#xA0; &#xA0; broker.id=2

&#xA0; &#xA0; port=9094

&#xA0; &#xA0; log.dir=/tmp/kafka-logs-2
```

Since we have Zookeeper and our first Kafka instance already running, we can kick start these two extra nodes to join the mix!

```
# bin/kafka-server-start.sh config/server-1.properties

# bin/kafka-server-start.sh config/server-2.properties
```

### Create a Topic

Let's create a topic with replication factor of three

```
# bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 3 --partitions 1 --topic replicated-topics
```

We can use "describe topics" command to describe how these brokers are structured. Remember we are now in cluster, and not a single broker instance.

```
# bin/kafka-topics.sh --describe --zookeeper localhost:2181 --topic replicated-topics

Topic:replicated-topics&#xA0;&#xA0; &#xA0;PartitionCount:1&#xA0;&#xA0; &#xA0;ReplicationFactor:3&#xA0;&#xA0; &#xA0;Configs:

&#xA0;&#xA0; &#xA0;Topic: replicated-topics&#xA0;&#xA0; &#xA0;Partition: 0&#xA0;&#xA0; &#xA0;Leader: 1&#xA0;&#xA0; &#xA0;Replicas: 1,2,0&#xA0;&#xA0; &#xA0;Isr: 1,2,0
```

To understand more about the output of each partitions. You can visit: [http://kafka.apache.org/documentation.html#quickstart](http://kafka.apache.org/documentation.html#quickstart)

### Sending Messages

So let's move forward and try to send some messages to our Topic:

```
# bin/kafka-console-producer.sh --broker-list localhost:9092 --topic replicated-topic

hello

hello 123
```

Then let's consume these messages

```
# bin/kafka-console-consumer.sh --zookeeper localhost:2181 --from-beginning --topic replicated-topic

hello

hello 123
```

### Testing the Configuration

For the final leg of this quick tutorial, let's see if our set-up is fault tolerant by breaking our Server-1 (Broker) who is currently the leader.

```
# bin/kafka-topics.sh --describe --zookeeper localhost:2181 --topic replicated-topics | grep Leader

&#xA0;&#xA0; &#xA0;Topic: replicated-topics&#xA0;&#xA0; &#xA0;Partition: 0&#xA0;&#xA0; &#xA0;Leader: 1&#xA0;&#xA0; &#xA0;Replicas: 1,2,0&#xA0;&#xA0; &#xA0;Isr: 1,2,0

# ps aux | grep server-1.properties

root &#xA0; &#xA0; &#xA0;5054 &#xA0;1.7 &#xA0;1.5 4836168 248592 pts/4 &#xA0;Sl+ &#xA0;05:12 &#xA0; 0:19 java -Xmx1G -Xms1G -server -XX:+UseParNewGC -XX:+UseConcMarkSweepGC.........

# kill -9 5054
```

# bin/kafka-topics.sh --describe --zookeeper localhost:2181 --topic replicated-topics | grep Leader
    Topic: replicated-topics    Partition: 0    Leader: 2    Replicas: 1,2,0    Isr: 2,0

You'll notice the leader switched to "server-2".  The messages should still be available for consumption even we shut our server-1.

```
# bin/kafka-console-consumer.sh --zookeeper localhost:2181 --from-beginning --topic replicated-topic
hello
hello 123
```

Reference: [http://kafka.apache.org/documentation.html](http://kafka.apache.org/documentation.html)

# Now for Automation

We can deploy a CoreOS instance using the cloud-init script to automate some of the tasks that were noted from our earlier (Ubuntu) tutorial.

So First, deploy a coreos instance and create a cloud-init script like the sample file I have below to start the essential services we need (i.e. docker, etcd2, and fleet). At the same time, this will also create the unit files which in this case, our Kafka and Zookeeper instances.

(make sure to generate a new discovery token)

After the installation, log-in to the machine (using 'core' as user), and ensure that docker, etcd2, and fleet are set to start everytime the machine reboot:

```
- systemctl enable docker
- systemctl enable etcd2
- systemctl enable fleet
```

Reboot the machine. Upon start-up, log-in again, and check the status of these services.

```
- systemctl status docker
- systemctl status etcd2
- systemctl status fleet
```

All three services should be up and running.

Now, we need bring up both Zookeeper and Kafka nodes. Since we already set the unit files, we can simply invoke these commands:

```
- fleetctl submit pktzoo-01.service
- fleetctl start pktzoo-01
- fleetctl status pktzoo-01
```

You can repeat the same procedure to start your Kafka node.
