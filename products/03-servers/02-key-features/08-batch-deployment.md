<!--<meta>
{
    "title":"Batch Deployment",
    "description":"Deploying devices in Batch",
    "tag":["Deploy", "Batch Deployment"]
}
</meta>-->

Batch deployment is a feature that enables you to deploy multiple servers at once with a single API call.   This is useful if you don't already use a tool like Terraform, which includes its own method for handling large deployments.

With batch deployments you can choose the server types & any facility that suits your particular deployment needs.  It is also possible to create several batches at once. The following example shows how to deploy a batch of three c1.small.x86 servers.

```
curl -X POST -H 'X-Auth-Token: API-TOKEN' -H 'Content-Type: application/json' -d '{
 "batches": [
        {
            "hostname": "test.server{{index}}.com",
            "description": "This is my test batch",
            "plan": "c1.small.x86",
            "operating_system": "ubuntu_16_04",
            "facility": "any",
            "billing_cycle": "hourly",
            "tags": ["test1", "test2"],
            "quantity": 3
         }
     ]
}' "https://api.packet.net/projects/PROJECT-ID/devices/batch"
```

Passing `"facility": "any"` the API selects which facility/facilities to deploy based on the most available capacity for the requested type. The above would deploy 10 servers. EWR1 could receive 7 and SJC1 could receive 3.

In addition to prioritized location selection, it is possible to indicate how many facilities to spread across. For this purpose, the parameter to use is: `facility_diversity_level = N`

Example:

```
"facility": ['sjc1', 'ewr1', 'any']"
"facility_diversity_level": 1
"quantity": 10

SJC1: 7 available
EWR1: 24 available
DFW1: 50 available
=> 10 deployed to EWR1
```

Another example, with larger batch request:

```
"facility": ['sjc1', 'ewr1', 'any']"
"facility_diversity_level": 2
"quantity": 25

SJC1: 7 available
EWR1: 24 available
DFW1: 50 available
=> 7 deployed to SJC1, 18 deployed to EWR1
```

If this parameter is not specified, we don't enforce any limit and device provisioning could be spread across 1 or 2 or all facilities.

### Naming Scheme: Series vs Custom

In terms of hostnames, you can handle this in two different ways:

*   __Hostname__:  You can create a parseable hostname, `"hostname":"s{{index}}.blah.com"`  where`{{index}}`  will be replaced during creation in a logical order (e.g. 1, 2, 3).
*   __Hostnames__: You can pass the API an array of hostnames. The following is an example for a batch of 3 servers:
`"hostnames": ["test.server1.com","test.server2.com","test.server3.com"]`.

**Note:** Please note that these are different JSON strings, `hostname` and `hostnames` respectively.


### Checking the Status of Batch Deployments

There are four states you can see:

*   queued
*   in_progress
*   completed
*   failed

A batch deployment starts as ‘queued’ once it is requested.  At this stage our worker will begin to work on validations & creations.

Once it passes validation, it will move to ‘in_progress’.  

If there are devices to fulfill the batch request(s), it will move to ‘completed’.

If for some reason we are unable to create all the devices, the batch request will be marked as ‘failed’ and you will be able to see why in `‘error_messages’`  returned by the API.

### Retrieving all Batches from a Project

You can use the API to retrieve all current and previous batches as follows:

```
curl -X GET -H "X-Auth-Token: API-TOKEN" "https://api.packet.net/projects/PROJECT-ID/batches"
```

**Note:** This API query might show a lot of batches because the Packet portal creates a batch of a single instance (quantity 1) for every server deployment. If you create server instances through the `/devices` API endpoint, it isn't considered a batch so it will not show in the batches API query.

### Using Batch Deployment with Spot Market

We actually created batch deployments while developing our [Spot Market](https://www.packet.com/developers/docs/getting-started/deployment-options/spot-market) feature, as we need to validate the prices / availability in batches before each spot instance is deployed.
