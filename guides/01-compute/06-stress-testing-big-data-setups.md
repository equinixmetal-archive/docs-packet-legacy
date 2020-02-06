<!-- <meta>
{
    "title": "Stress Testing Big Data Setups",
    "description": "Stress Testing Big Data Setups",
    "tag": ["Stress Testing", "Big Data"],
    "seo-title": "Stress Testing Big Data Setups - Packet Technical Guides",
    "seo-description": "Stress Testing Big Data Setups",
    "og-title": "Stress Testing Big Data Setups",
    "og-description":"Stress Testing Big Data Setups"
}
</meta> -->

_Note: This post was prepared by our friends at [MityLytics](https://mitylytics.com/)._


MityLytics software helps customers plan, build and operate high-performance data pipelines. It keeps data pipelines running at peak performance so customers can deploy their data-driven revenue generating applications faster and maintain uptime at higher levels than before.

At MityLytics, we keep running performance benchmarks on a variety of hardware and software combinations to allow our customers to establish upper bounds on performance for their Big Data applications on their current or planned infrastructure in the public cloud or on-premise.

So far our efforts have concentrated on cloud-based deployments, but recently we were introduced to Packet, a cloud-provider that offers bare metal servers in the cloud, so we decided to build a data pipeline testbench in an increasingly popular configuration (Kafka message broker, Spark for streaming and Cassandra for data storage) using our software and share our observations and experiences.

Our goals for this project are to establish infrastructure bounds for real-time data pipeline performance when all these systems are running together on bare-metal servers. This, as you will see, helps to characterize and then scale the system when load is increased on the systems.

We decided to craft our testbench with five nodes, with more than one server type. Unlike recommendations from the software stack vendors, we are not going to break the bank and over-provision, since we have been able to characterize the performance of each of the stacks in the past.

We will explain shortly how we settled on the components in the pipeline.

## Methodology

1. Run system stress systems for each individual component stack till the point of saturation.
2. Measure performance at different levels of stress to come up with peak operations/sec with acceptable latency.
3. Characterize the performance in terms of resource usage and establish upper bounds on throughput and latency.
4. Identify the infrastructure components that bound the performance of the component stack.

Execute steps 1-4 above for software stacks deployed and running in 2 scenarios,

1. In isolation on clusters by themselves.
2. Running on a multi-tenant - meaning co-located clusters. Clusters in the data pipeline share components.

## The Setup

The packet has [many types of servers](https://www.packet.com/cloud/) and compared to other vendors the capabilities of each server type have been well thought of especially in the context of building Big Data platforms. For the purposes of this test, we decided to use their Type 1 and Type 2 servers.

Here is a summary of the Server Configuration (for further details, please check the [Packet.net website](https://www.packet.com/cloud/)):

![Server Configuration](/images/stress-testing-big-data-setups/server-configuration-table.png)

## Design considerations

The diagram below shows how Kafka, Spark, and Cassandra were installed on each of the five nodes under consideration.

![nodes-and-software](/images/stress-testing-big-data-setups/nodes-and-software.png)

Figure 1: Nodes and Software Framework

In the sections below, we explain the details of each software stack.

### Kafka Cluster

This cluster had three Type 1 nodes. We chose Type 1 because we wanted at least 32GB of RAM and realized that we don't need a lot of computing power given that in general Kafka is network bound incoming messages are from the WAN (IoT devices, sensors, location software etc.). The nodes are named Kafka01, Kafka02 and Spark-Cassandra-Master. The third node name is reflective of the fact that it is a node being used by a Spark and Cassandra cluster as we explain in the section below.

Zookeeper, the Kafka management framework, is run on Kafka01. We have started the Kafka server on all three nodes. As we see in the benchmarks below, we have shown that we can exceed [established Kafka benchmarks](https://www.google.com/url?q=https://engineering.linkedin.com/kafka/benchmarking-apache-kafka-2-million-writes-second-three-cheap-machines&sa=D&ust=1479794146722000&usg=AFQjCNEGcPh_jdvLUyArZgk_4M57dNlXAw) (Linkedin) with Type 1, the second-most economical Packet nodes.

### Spark and Cassandra co-located Cluster

The Spark cluster has been setup with one Type 1 node as the Spark Master and two Type 2 Packet nodes as the Spark Workers. The nodes are named Spark-Cassandra-Master, Spark-Cassandra-Worker01 and Spark-Cassandra-Worker02. The Cassandra cluster has been set up on all of these three nodes as well and run in the Cassandra ring topology with 256 tokens.

Now you may ask why we did this; well we chose to follow the recommendations of Spark and Cassandra vendors, however, given the nature of the Packet instances and high network throughput (20 Gbps) between Type 2 and Type 3 nodes we could have potentially split the cluster, where Spark and Cassandra do not share any nodes. Spark can live on Type 2 because it does a lot of in-memory processing and 256 GB of RAM is ideal for this type of node. Cassandra can be on Type 3 since it needs a lot of persistent high-speed storage (enabled with NVME on Type-3 nodes).

So coming back to this experiment we established a 3-node cluster with Type 2 servers as Spark workers and a Type 1 node as the Spark master. We chose Type 2 primarily because of its higher RAM and SSD capacity given that both Spark and Cassandra stacks will be running on it. This cluster is enough to characterize the performance of a co-located Spark and Cassandra cluster in order to understand the way to scale the deployment.

# Benchmarks

Our approach to benchmarking is not just pure performance measurement with a specific configuration but also to get a characterization of the systems under test. The approach:

* Run benchmarks in isolation on the cluster and get KPI to establish upper bounds on the performance of the software stack on the chosen hardware configuration.
* Run benchmarks together with each other to get an upper bound on performance when software stacks run together on chosen hardware configuration.
* Compare performance in the 2 cases above to see if clusters for the software stacks should be isolated or if they should continue to be co-located and to understand the cost/performance tradeoffs.

To benchmark the system, we first deployed our agent software to collect detailed system information from each node. We used the MityLytics analytics software to track how much our infrastructure each node and software stack was using.

## Test 1: Kafka stress test

### Test Specifics

For testing, we used the Kafka stress test utility, that is bundled with Apache Kafka installations to saturate the cluster via the following tests,

1. Producer Performance test on Kafka01. The test produces 50 million messages to a topic each of size 100 bytes, with a replication factor of 3 and partition size of 6. We measure the messages produced per second, throughput, average and maximum latency. The Producer perf is run with different throughput parameters of 100K, 1M and 10M messages per second. These parameters are chosen to verify the upper bound at which the platform can produce messages to various queues in the 6 partitions.
2. Consumer Perf test on Kafka02. This test consumes the 50 million messages earlier produced to the topic. The consumption rate, messages per second, throughput are measured while this test is run.
3. Simultaneous producer perf on Kafka01 and consumer perf on Kafka02. The producer perf will generate 50 million messages to a topic and simultaneously the consumer perf will consume the messages as they are getting generated.

![nodes-in-cluster](/images/stress-testing-big-data-setups/nodes-in-cluster.png)

Figure 2: The nodes in the Kafka cluster showing their respective role

### Test Results

**Kafka Statistics**

The table below shows throughput and latency numbers for each Producer test,

![Kafka Statistics Table](/images/stress-testing-big-data-setups/kafka-statistics-table.png)

The performance of the Kafka consumer peaked at about 1.68 million messages/sec with 10 Million/sec as the producer rate. However, there was minimal effect on latency between 1 Million and 10 Million records/second although the system was saturated. The system scales well since on most systems latency lags bandwidth.

So we can see that the producer essentially is the limiting factor for message throughput. We can get a maximum rate of 1.3 million messages/sec when running a Producer and consumer together.

#### **Infrastructure Observations**

While running the test we observed the following out from our analytics:

* CPU usage was minimal as expected (less than 23% utilization), therefore the CPU can be used for other tasks like number crunching; so it helps to have the right job mix.
* Memory on all three nodes (Kafka-01, Kafka-02 and Spark-Cassandra-Master) was pretty much close to the total memory available 32GB utilization for the duration of the test and used swap space on the Kafka nodes was minimal (< 5MB). This leads us to believe that Kafka is pre-allocating memory.

![memory-usage](/images/stress-testing-big-data-setups/memory-usage.png)

Figure 3: Memory usage on the Kafka Node

* As expected network performance bounds the performance of Kafka and as we can see from the above table we hit the ceiling of 1 Gbps/sec when we tried to saturate the cluster with a record rate of 10 million/sec. We were able to reach a peak rate of 90K TCP segments sent /second and 45K TCP segments received / second.
* From a storage perspective, we saw that it definitely helps to have SSD; since we saw disk performance go up to 300K write operations/sec across the two SSDs in a RAID1 configuration.

### Test Summary

To summarize the results from the tests:

* Kafka stress test numbers beat the numbers [published by LinkedIn](https://engineering.linkedin.com/kafka/benchmarking-apache-kafka-2-million-writes-second-three-cheap-machines) given that our Type 1 hardware is very similar to what they used given that we have less computing power but better performant disks.
  - LinkedIn: Single producer thread, 3x synchronous replication - 421,823 records/sec (40.2 MB/sec)
  - Packet: Single producer thread, 3x synchronous replication - 1,292,958 records/sec (123.31 MB/sec)
* Kafka is memory and network bound. Type 1 nodes on Packet seem like a good fit, especially since we don't need high computing power. However, given that Kafka does replication, this could be changed to a RAID 0 configuration very easily on Packet - we really like this flexibility and we are am sure folks everywhere will love this.

## Test 2: Spark Stress Test

### Test Specifics

The Spark-Perf benchmark was run with Spark batch tests and the tests were scaled up gradually in order to stress the cluster under test ultimately saturating the cluster to establish the peak operation rate achieved and the infrastructure resource that bound the operation rate. The spark jobs were sent to the executors, which are running on Spark-Cassandra-Worker01 and Spark-Cassandra-Worker02. Note: When we ran the Spark tests, although we had the Cassandra servers up and running we did not run any other tests at the same time

![spark-cluster](/images/stress-testing-big-data-setups/spark-cluster.png)

Figure 4: Spark cluster depicting Master and Worker node

### Test Results

#### **Spark Statistics**

![Spark Statistics Table](/images/stress-testing-big-data-setups/spark-statistics-table.png)

![scale-vs-task-per-stage](/images/stress-testing-big-data-setups/scale-vs-task-per-stage.png)
![scale-vs-shuffle-read](/images/stress-testing-big-data-setups/scale-vs-shuffle-read.png)
![scale-vs-shuffle-read-time](/images/stress-testing-big-data-setups/scale-vs-shuffle-read-time.png)
![scale-vs-shuffle-read-1](/images/stress-testing-big-data-setups/scale-vs-shuffle-read-1.png)
![scale-vs-shuffle-write](/images/stress-testing-big-data-setups/scale-vs-shuffle-write.png)

Figure 5: Spark performance test: scale factor vs various metrics

**Observation**

1. Scale factor defines partitioning - i.e. how much processing you want to do in parallel
2. Between scale factor 1, 2 and 3
  1. Input data for writes is the same but max write time is non-linear - contention could be disk or memory - let's look into that in the section below
  2. Data being read and Shuffle read time also increases non-linearly
3. Scale factor 3 job was stuck at a stage where tasks were not progressing. After looking at the infrastructure data, the following stands out:
  1. Memory on the Master node is saturated (31.09GB/ 31.2GB used up).
  2. CPU stats show that the worker is at close to 92% CPU utilization on one Worker and 79% on the Master.
  3. The Master can handle 800 tasks per stage, corresponding to scale factor 2. On the other hand, when 1200 tasks per stage are presented to it, corresponding to scale factor 3, it isn't able to schedule them to the workers. If the Master is not limited by the number of tasks per stage, the Workers will become CPU bound before they become memory bound, from our observations.
  4. So in order to scale gracefully, the Master memory needs to be scaled up while the number of available workers needs to be increased which will result in more CPU available.
  5. In conclusion, we have successfully figured out which resource dimensions we need to scale in as the problem size increases.

![scale-factor-3](/images/stress-testing-big-data-setups/scale-factor-3.png)

Figure 6: Scale factor 3 CPU stats show worker 1 at ~90

![memory-used](/images/stress-testing-big-data-setups/memory-used.png)

Figure 7: Memory used on Master is saturate

![memory-workers](/images/stress-testing-big-data-setups/memory-workers.png)

Figure 8: Memory on the Workers is at ~46GB out of 256 Gb that is available

#### **Infrastructure Observations**

The below observations are for scale factor less than

* CPU usage was as follows:
  - On average 2% for the Spark master node with a peak utilization of 41%![master](/images/stress-testing-big-data-setups/master.png) Figure 9: Master node CPU utilization

* On average 23-25% for the Spark worker nodes with a peak utilization of 69%![worker](/images/stress-testing-big-data-setups/worker.png) Figure 10: Worker node CPU utilization
* We reached a maximum of 45GB (256GB total) memory utilization on the worker nodes and 25GB (total: 32GB) on the master node until scale factor 2. For scale factor 3 we hit memory saturation for Master node, while the Worker node was way below memory limit ~ 45 GB.
* The network was not at all saturated, the maximum achieved network throughput we observed was 134 Mbps while we have seen that the network can easily scale up to.
* From a storage perspective we saw the following numbers:
* We saw a peak of 633K writes/sec on the Spark-Cassandra master node.
* 333K writes/sec on the Spark-Cassandra worker nodes and the Kafka nodes.
* However, the workers are Type 2 with RAID0 and therefore should have gotten better performance than the Type 1 with RAID1; our explanation for this is that most of the work on the worker nodes for this was done in-memory given the high CPU utilization observed there.

#### **Test Summary**

* Spark can be both CPU and Memory bound, however, given the configuration of Type 2 servers, we didn't run into any limits till scale factor 2. After we started tests with scale factor 3, our application was stuck after running for more than 2.5 hours. Out of the 21 stages, just 12 stages were completed, while the 13th stage was showing an estimated time of 602.5 hours!!
* Type 1 servers are a good fit for the Spark master nodes with the number of tasks per stage being less than ~800. When we go over that to ~1200 tasks per stage, the type 1 master runs out of juice for scheduling the tasks on the executors.
* Type 2 servers are adequate for Spark workers especially when Spark is run in isolation. For a higher rate of tasks ~1200 per stage, type 2 should also be used as the Master.
* Type 3 servers should be considered for Spark workers when spark nodes are co-located with Cassandra.
* One other configuration could be type 2 servers for Spark and type 3 nodes for the Cassandra data nodes. Given Packet's unique 20Gbps bonded network between nodes and the low latency communication, it would be very effective.

## Test 3: Apache Cassandra Benchmark

### Test Specifics

The Cassandra test setup comprises of 3 nodes namely Spark-Cassandra-Master, Spark-Cassandra-Worker01 and Spark-Cassandra-Worker02. All nodes run in the Cassandra ring topology with 256 tokens. We run Cassandra Stress on this cluster with a mixed write-read ratio of 1:3, operations happen for a duration of 45 mins, which correspond to ~70+ million operations with a uniform key distribution in the range of 0 - 1M. The number of threads attempting to do this is limited to 16 - 256 client threads

![cassandra](/images/stress-testing-big-data-setups/cassandra.png)

Figure 11: The Cassandra cluster in the ring topology in our benchmark

### Test Results

#### Cassandra Statistics

The table below shows operations rate and the latency for the duration of the test. These are great numbers especially with the low latency numbers which usually lags bandwidth

![Cassandra Statistics Table](/images/stress-testing-big-data-setups/cassandra-statistics-table.png)

#### Infrastructure Observations

* CPU usage was as follows:
  - On average 15% for the master node with a peak utilization of ~45%
  - On average 30% of the worker nodes with a peak utilization of ~40%
* We reached a maximum of 22GB memory utilization on the worker nodes and 27GB on the master node.
* The network was not at all saturated, the maximum bandwidth we observed was close to 1 Gbps on the type 2 worker nodes.
* This time, given that we were running on Type 2 nodes with SSD and no RAID, we got almost double the performance with 113K write operations/second.

![number](/images/stress-testing-big-data-setups/number.png)

Figure 12: Number of writes on the worke

![number-1](/images/stress-testing-big-data-setups/number-1.png)

Figure 13: Number of writes on the master


#### Test Summary

* Cassandra is mostly CPU bound ; however, given the configuration of Type 2 servers, we didn't run into any limits. As shown in the figures below, Cassandra stress run on Type 2 has a max CPU utilization of ~40%. When the same test is run on Type 1 the average CPU utilization ~80%.

![cpu](/images/stress-testing-big-data-setups/cpu.png)

Figure 14: CPU utilization on type 2 worker nod

![cpu-1](/images/stress-testing-big-data-setups/cpu-1.png)

Figure 15: CPU utilization on type 1 master nod

* Cassandra should run on type-2 or type-3 nodes depending on the storage required. The advantage with Type-3 is Cassandra can run in isolation given the 20Gbps network between Type-2 and Type-3 nodes. Type-2 can host spark workers.

## Test 4: Combined Testing

### Test Specifics

We finally test a combination of all the tests which we have executed in the different clusters in the previous sections. If you look at the figure below (Fig 4), Spark-Cassandra-Master is the common node between the Kafka, Spark, and Cassandra cluster and as detailed above, the Spark and Cassandra clusters are exactly the same

In the setup of this test, we run Kafka on Kafka01, Kafka02 and Spark-Cassandra-Master. Kafka01 has a producer running which writes 300M messages to all the partitions in the cluster

Spark-Cassandra-Worker01 is running a consumer simultaneously to consume all the 300M messages produced on Kafka01

Spark-Cassandra-Master is launching Spark batch tests as the Spark master node via the spark-submit utility. The executors for this job are running on worker nodes - Spark-Cassandra-Worker01 and Spark-Cassandra-Worker02

Finally, we have a Cassandra cluster on Spark-Cassandra-Master, Spark-Cassandra-Worker01 and Spark-Cassandra-Worker02. We run Cassandra stress test on Spark-Cassandra-Worker01

The setup details are also shown in the figure below. Spark-Cassandra-Worker01 is the node which is running Spark streaming performance as a Spark worker, Kafka consumer, and Cassandra stress.

![cassandra-1](/images/stress-testing-big-data-setups/cassandra-1.png)

Figure 16: Running all the performance tests together to stress test Spark-Cassandra-Worker0

### Test Results

#### Cassandra Results

Cassandra stress runs well with similar numbers as if it was running by itself. This is a key to a well-performing pipeline since we always want the database to work as if it had a cluster by itself

![Cassandra Results Table](/images/stress-testing-big-data-setups/cassandra-results.png)

Cassandra test results as compared to the standalone test show that there is minimal difference in the results. We again are able to achieve low latency which is great for building a Real-Time data pipeline. Type 2 nodes for the Cassandra cluster are therefore highly recommended

#### Spark Results

The table shows the performance of the Spark cluster when run in isolation and when run with the Spark and Cassandra tests (Combined) using the spark-perf utility.

![Spark Results Table](/images/stress-testing-big-data-setups/spark-results.png)

Running comparable spark-perf tests particularly show that shuffle read times increased to almost double for the combined test. This is because of high network activity on the cluster on account of the Kafka and Cassandra tests

#### Kafka Results

The table below shows the performance of the Kafka consumer for both the individual and combined test

![Kafka Results Table](/images/stress-testing-big-data-setups/kafka-results.png)

The above shows that the rate of data consumption has decreased by ~27% when the test ran individually compared with when it was run with all the other components

#### Infrastructure Observations

* CPU usage was as follows:
  - On average 26% utilization for the master node with a peak utilization of 75%
  - On average 41-58% utilization for the worker nodes with a peak utilization of 88%

  ![cu-stats](/images/stress-testing-big-data-setups/cu-stats.png)

  Figure 17: CU stats across all the nodes. Worker01 is node under stress

* We reached a maximum of 48GB (256GB total) memory utilization on the worker nodes and close to 32GB (total: 32GB) on the master node.

![global-memory-usage](/images/stress-testing-big-data-setups/global-memory-usage.png)

Figure 18: Memory used by all the node

* The maximum achievable network bandwidth we observed was 1.2 Gbps.

![tcp-segments](/images/stress-testing-big-data-setups/tcp-segments.png)

Figure 19: TCP segments sent and receive

* We did see similar numbers for storage performance as seen before
  - 633K writes/sec on the Spark-Cassandra master node
  - 333K writes/sec on the Spark-Cassandra worker nodes and the Kafka nodes

  ![ssd-global](/images/stress-testing-big-data-setups/ssd-global.png)

  Figure 20: SSD writes across all the cluster

# Conclusions

So what we have done in this exercise is so far is

1. Selected the infrastructure components for a real-time data pipeline
2. Ran stress tests on the components of the data pipeline in isolation to get peak rates of performance when there is no contention for resources
3. Ran stress tests on the components of the data pipeline when they work in tandem to identify the contention for resources
4. Derived insights into scaling individual clusters in the right dimensions, co-location and maintaining performance and provided guidance on price/performance trade-off

Specifically, let's examine the clusters in sequence;

* Kafka Cluster: There is a change in benchmark performance between running in isolation and in tandem with other components. The Kafka consumers residing on spark clusters contend with Spark stream processing on the worker nodes. Kafka standalone performance is bound by network throughput as seen by stressing the system and getting to a peak of 1.7 million messages being produced.

* Kafka-Spark consumer: There is a 27% degradation in throughput when the Kafka consumer is placed on the Spark worker node. This is attributed to the fact that:

* The Spark workers and the Kafka consumers are contending for resources (SSD and CPU).
* More specifically, the Cassandra data node and the Spark master are shared with the Kafka broker node so SSD writes for incoming data on the Kafka cluster are competing with Cassandra writes.

However, the Kafka-Spark consumer works well with a 99% percentile latency of 14 milliseconds being achieved by the producer, so it is not back-pressuring the Kafka producer.

The Spark-Cassandra co-located cluster is the recommended way to deploy as per the software vendors. However, while running the stress test for the pipeline we observed the following:

* Spark performance is off by a peak of 50% but on average it is off by about 15%
* Cassandra performs with a negligible performance hit, which is good. A few observations:
* The co-located performance is not bound by network
* CPU Utilization hit a maximum of (30%) so additional computing power is not needed. Bare-metal servers make a difference since the resources are not shared.
* Multiple runs yielded the same result, so we were able to get reliable performance numbers
* Bare-metal servers in the cloud are a huge advantage. This is something that not many other providers have and provides a great economical alternative to expensive co-location.
* Separating the Spark-Cassandra cluster is something that is well worth exploring on Packet given the dedicated 20 Gbps network, so Spark Worker nodes can live on Type 2 servers and Cassandra can live on Type 3 or Type 4. Also given that RAID configurations are flexible and available during runtime one can easily switch to RAID0 on all types of instances given that software replication is provided by the stacks.

## Experiences with Packet

* The machines on Packet are very easy to provision and get provisioned within minutes, unlike other bare-metal server providers.
* Packet gives us four easy to use options as opposed to a multitude of options with other providers. This is how we recommend you should organize your clusters:
  - Type 0 machines for development environments
  - Type 1 for non-intensive apps or master nodes for frameworks such as Hadoop master nodes, Spark master nodes, and Kafka workers or for stage environments
  - Type 2 for Spark worker nodes
  - Type 3 as data nodes. These will work well as Cassandra data nodes

* At $1.75 / hour a Packet Type 3 node is half the price of AWS instances (i2.8xlarge) being recommended by Cassandra vendors and, in addition, comes with NVME.

## Summary

We have been able to run tests, get good performance, and get performance indicators by intelligently choosing the right hardware and software stack at different scale points. Our aim was to find the peak performance rates and the saturation points for the problem set size on a given infrastructure configuration. Once we identified the saturation points we were able to identify the right resources to scale up in order to continue to meet performance goals. For us, low latency is key to good pipeline performance and the Packet infrastructure has given us just that

Comparison with our tests on virtualized infrastructure from AWS in the context of Spark-perf performance. Here are a few salient points

1. With the Spark-perf test suite and scale factor of 1 is required to be run on a cluster with 20 m4.xlarge AWS instances, however, we were able to do this with just 3 Type 2 nodes in 35 minutes. It is great to see this performance at this price point.
2. The Spark-Cassandra cluster is recommended to be run on i2.8xlarge nodes on AWS, which costs ~$3/hour after discounting, however on Packet the cost would be $1.50 with dedicated bandwidth, the low latency 20 Gbps network and with the flexibility in organizing the cluster such that the full power of the high-performance network can be used.

And BTW

MityLytics has proprietary algorithms that predict and simulate Big Data frameworks via the MityLytics portal - [contact us](https://mitylytics.com/contact/) if you want to know more.
