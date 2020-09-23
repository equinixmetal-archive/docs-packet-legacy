<!-- <meta>
{
    "title":"BGP Global Communities",
    "description":"Packet's supported BGP Communities and their use",
    "tag":["BGP", "Communities", "Peering"],
    "seo-title": "BGP Global Communities - Packet Technical Guides",
    "seo-description": "Using BGP communities on Packe",
    "og-title": "Global BGP Communities on Packet.",
    "og-description": "Check out all of Packet's supported BGP Communities and their use in this technical guide."
}
</meta> -->



# BGP Global Communities

## Default Behavior

The default behavior (no community) for customer prefixes is that they are advertised to all providers and peers within the facility the prefix is received in.

## Global Anycast BGP
If you're using an IP range across multiple regions you can use Packet's Anycast community:

**54825:222**

-   Function: Anycast routing
-   By tagging your routes with this community, Packet will advertise your routes to only transit and peering we maintain consistently on a global basis. Regional ISPs we connect with (e.g. Verizon in the New York metro area) will not learn your routes, as advertising to them may result in "scenic" routing for you with global Anycast configurations.
-   Please note that this community should only be used for global Anycast deployments and is not advised for use in a single datacenter, as it will limit the number of available paths/providers you have access to. It should only be deployed by you seeking BGP Anycast topology, with multiple server instances deployed in each Packet datacenter.


## Advanced BGP

You can fine tune reachability to the IPs you announce by attaching Traffic Engineering (TE) Communities.

The purpose of TE Communities is to tell the Packet network which providers and peers to advertise your prefixes to, allowing for more granular control than default (sans-community) BGP or the Global Anycast BGP community referened above (54825:222).

Using any of the communities listed below gives you full control over the oubound advertisment of your prefixes. You are able to advertise to any combination of providers and peers that exist within a location. Each provider has its own set of communities. If a provider's community is not included on a prefix, we will not advertise it to that provider.


### Combining Communities

You are able to combine communities for granular control of your announcements. For example, you can use a combination of communities to advertise to Telia and Zayo, but not Limelight. Or you could advertise to Telia, prepend three times to Zayo, and advertise to an Internet Exchange (IX).


### Usage Guidelines

To use the communities correctly please follow the guide below:

-   Other communities such as 54825:222 and 54825:223 should be removed

-   To advertise a prefix to any provider, the “Advertise to XXX” must be used. E.g. to advertise to Telia, 54825:500 must be used. If only a single provider community is used, the prefix will only be advertised to that provider.

-   Combine communities to advertise to multiple providers, e.g. Use 54825:500 & 54825:510 to advertise to both Telia and Zayo

-   To prepend you must include the “Advertise to XXX” community as well as the prepend community. E.g to prepend two times to Limelight, you must use 54825:530 & 54825:532. This tells our routers to advertise to Limelight, and prepend twice.



### Transit Providers



**Telia Communities - ASN 1299**

Available in All Facilities (except SYD2, HKG, NRT, YYZ)


| Community | Function |
|--|--|
| 54825:500 | Advertise to Telia|
| 54825:501 | Prepend one time|
| 54825:502 | Prepend two times|
| 54825:503 | Prepend three times|


**Zayo Communities - ASN 6461**

Available in All Facilities (except SYD2, NRT, SIN, HKG)

| Community | Function |
|--|--|
| 54825:510 | Advertise to Zayo|
| 54825:511 | Prepend one time|
| 54825:512 | Prepend two times|
| 54825:513 | Prepend three times|


**Hibernia Communities - ASN 5580**

Available in NRT1

| Community | Function |
|--|--|
| 54825:520 | Advertise to Hibernia|
| 54825:521 | Prepend one time|
| 54825:522 | Prepend two times|
| 54825:523 | Prepend three times|


**Cogent Communities - ASN 174**

Available in SJC2

| Community | Function |
|--|--|
| 54825:540 | Advertise to Cogent|
| 54825:541 | Prepend one time|
| 54825:542 | Prepend two times|
| 54825:543 | Prepend three times|

**Telstra - ASN 4637**

Available in NRT1, SIN3, HKG2, SYD2


| Community | Function |
|--|--|
| 54825:620 | Advertise to Telstra|
| 54825:621 | Prepend one time|
| 54825:622 | Prepend two times|
| 54825:623 | Prepend three times|

**GTT Communities - ASN 3257**

Available in SYD2


| Community | Function |
|--|--|
| 54825:590 | Advertise to GTT|
| 54825:591 | Prepend one time|
| 54825:592 | Prepend two times|
| 54825:593 | Prepend three times|


### Private Network Interconnects

**Sprint Communities - ASN 1239**

Available in DFW, EWR, ORD, DTW, IAD, LAX, ATL, IAH


| Community | Function |
|--|--|
| 54825:570 | Advertise to Sprint|
| 54825:571 | Prepend one time|
| 54825:572 | Prepend two times|
| 54825:573 | Prepend three times|


**StackPath - ASN 33438**

Available in SJC


| Community | Function |
|--|--|
| 54825:580 | Advertise to StackPath|
| 54825:581 | Prepend one time|
| 54825:582 | Prepend two times|
| 54825:583 | Prepend three times|


**Google**

Available in SJC, IAD, DC13, EWR, NY5


| Community | Function |
|--|--|
| 54825:600 | Advertise to Google|
| 54825:601 | Prepend one time|
| 54825:602 | Prepend two times|
| 54825:603 | Prepend three times|




### Internet Exchanges

**AMS-IX**

Available in AMS


| Community | Function |
|--|--|
| 54825:800 | Advertise to AMS-IX|
| 54825:801 | Prepend one time|
| 54825:802 | Prepend two times|
| 54825:803 | Prepend three times|


**NYIIX**

Available in EWR, NY5


| Community | Function |
|--|--|
| 54825:810 | Advertise to NYIIX|
| 54825:811 | Prepend one time|
| 54825:812 | Prepend two times|
| 54825:813 | Prepend three times|



**EQIX-NY**

Available in EWR, NY5


| Community | Function |
|--|--|
| 54825:820 | Advertise to EQIX-NY|
| 54825:821 | Prepend one time|
| 54825:822 | Prepend two times|
| 54825:823 | Prepend three times|



**DECIX-NY**

Available in EWR, NY5


| Community | Function |
|--|--|
| 54825:830 | Advertise to DECIX-NY|
| 54825:831 | Prepend one time|
| 54825:832 | Prepend two times|
| 54825:803 | Prepend three times|



**EQIX-SJC**

Available in SJC, SV5


| Community | Function |
|--|--|
| 54825:840 | Advertise to EQIX-SJC|
| 54825:841 | Prepend one time|
| 54825:842 | Prepend two times|
| 54825:843 | Prepend three times|


**SFMIX**

Available in SJC, SV5

| Community | Function |
|--|--|
| 54825:850 | Advertise to SFMIX|
| 54825:851 | Prepend one time|
| 54825:852 | Prepend two times|
| 54825:853 | Prepend three times|



**EQIX-NRT**

Available in NRT1


| Community | Function |
|--|--|
| 54825:870 | Advertise to EQIX-NRT|
| 54825:871 | Prepend one time|
| 54825:872 | Prepend two times|
| 54825:873 | Prepend three times|



**EQIX-IAD**

Available in IAD, DC13


| Community | Function |
|--|--|
| 54825:880 | Advertise to EQIX-IAD|
| 54825:881 | Prepend one time|
| 54825:882 | Prepend two times|
| 54825:883 | Prepend three times|



**EQIX-DFW**

Available in DFW2


| Community | Function |
|--|--|
| 54825:890 | Advertise to EQIX-DFW|
| 54825:891 | Prepend one time|
| 54825:892 | Prepend two times|
| 54825:893 | Prepend three times|




**DECIX-DFW**

Available in DFW


| Community | Function |
|--|--|
| 54825:900 | Advertise to DECIX-DFW|
| 54825:901 | Prepend one time|
| 54825:902 | Prepend two times|
| 54825:903 | Prepend three times|




**EQIX-SYD**

Available in SYD2


| Community | Function |
|--|--|
| 54825:910 | Advertise to EQIX-SYD|
| 54825:911 | Prepend one time|
| 54825:912 | Prepend two times|
| 54825:913 | Prepend three times|


**EQIX-SIN**

Available in SIN3


| Community | Function |
|--|--|
| 54825:920 | Advertise to EQIX-SIN|
| 54825:921 | Prepend one time|
| 54825:922 | Prepend two times|
| 54825:923 | Prepend three times|


**ANY2 LA**

Available in LAX2


| Community | Function |
|--|--|
| 54825:930 | Advertise to ANY2 LA|
| 54825:931 | Prepend one time|
| 54825:932 | Prepend two times|
| 54825:933 | Prepend three times|

**EQIX ORD**

Available in ORD


| Community | Function |
|--|--|
| 54825:940 | Advertise to EQIX Chicago|
| 54825:941 | Prepend one time|
| 54825:942 | Prepend two times|
| 54825:943 | Prepend three times|

**EQIX HK**

Available in HKG2

| Community | Function |
|--|--|
| 54825:950 | Advertise to EQIX Hong Kong|
| 54825:951 | Prepend one time|
| 54825:952 | Prepend two times|
| 54825:953 | Prepend three times|

**DE-CIX FRA**

Available in FRA2

| Community | Function |
|--|--|
| 54825:960 | Advertise to DE-CIX Frankfurt|
| 54825:961 | Prepend one time|
| 54825:962 | Prepend two times|
| 54825:963 | Prepend three times|

**EQIX ATL**

Available in ATL

| Community | Function |
|--|--|
| 54825:970 | Advertise to Equinix  Atlanta|
| 54825:971 | Prepend one time|
| 54825:972 | Prepend two times|
| 54825:973 | Prepend three times|

### Additional communities for Internet Exchanges only

These communities can be attached to prefixes advertised to any Internet Exchange.  This allows you to advertise to the whole IX, except for some specific peers.  We are able to add more of these communities by request.

| Community | Function |
|--|--|
| 54825:6939 | Do not advertise to Hurricane Electric
| 54825:15169 | Do not advertise to Google|

Most IX support their own "do not advertise" communities in the format of 0:ASN where ASN is the peer not to advertise too.  We will pass on these communities if they are attched on your prefixes.

### Other communities

**54825:666**

-   Function: BGP blackhole.
-   Packet will blackhole traffic to your prefix, as well as signal supporting transit providers and peering partners to do the same.
-   We support de-aggregation down to the /32 (IPv4) and /128 (IPv6) level with this community only.
