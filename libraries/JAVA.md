<!-- <meta>
{
    "title":"Java",
    "slug":"java",
    "description":"An official Java client for the Packet API",
    "author":"Zalkar Ziiaidin",
    "github":"zalkar-z",
    "date": "2019/12/11",
    "tag":["Java", "CLI"]
}
</meta> -->

![Packet Java API Client Banner](/images/libraries/java/java-banner.png)

Welcome to [Packet Java API Client](https://github.com/packethost/packet-java).

Lightweight Java client library for accessing Packet REST APIs with project based (JVM hosted languages) on Java, Groovy, Scala, Clojure, etc.

For more information about our API endpoints, please visit our [API Documentation](https://www.packet.com/developers/api/).

## Installation

Packet API Java Client is available in [Maven Central Repo](https://search.maven.org/search?q=g:net.packet%20AND%20a:java-client).

**Maven dependency**

```
<dependency>
    <groupId>net.packet</groupId>
    <artifactId>java-client</artifactId>
    <version>1.0.0</version>
</dependency>
```

**Gradle/Grails dependency**

```
compile 'net.packet:java-client:1.0.0'
```

**Groovy Grape**

```
@Grapes(
@Grab(group='net.packet', module='java-client', version='1.0.0')
)
```

**Scala SBT**

```
libraryDependencies += "net.packet" % "java-client" % "1.0.0"
```

**Note**: For Android projects, kindly include the httpclient-android library explicitly in your project dependencies.

## Usage

```
// Passing authToken and version
Packet apiClient = new PacketClient("authToken", "1");

// Passing authToken, version and HTTP Client. Create a http client with custom settings
CloseableHttpClient httpClient = HttpClients.createDefault();
Packet apiClient = new PacketClient("authToken", "1", httpClient);
```

## Routes & Methods

For more information on available router and methods, please visit [Packet Java CLI public repo](https://github.com/packethost/packet-java).

