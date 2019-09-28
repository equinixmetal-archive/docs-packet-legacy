<!--<meta>
{
    "title":"Deployment: Batch",
    "description":"Deploying devices in Batch,
    "date": "09/20/2019",
    "tag":["Deploy", "Btach Deployment"]
}
</meta>-->

Batch deployment is a feature that enables you to deploy multiple servers at once with a single API call.   This is useful if you don't already use a tool like Terraform, which includes its own method for handling large deployments.

With batch deployments you can choose the server types & any facility that suits your particular deployment needs.  It is also possible to create several batches at once, such as in the following example, which shows how to deploy three c1.small.

```
{ 

    'batches": \[

        {

            "hostname": "test.server.com".

            "description": "This is my test server",

            "plan": "c1.small",

            "operating\_system": "coreos\_stable",

            "facility": "any",

            "billing\_cycle": "hourly",

            "tags": \["test1", "test2"\],

            "quantity = 10"

            \]

}
```
Passing `facility any` the API selects which facility/facilities to deploy based on the most available capacity for the requested type. The above would deploy 10 servers. EWR1 could receive 7 and SJC1 could receive 3. 

In addition to prioritized location selection, it is possible to indicate how many facilities to spread across. For this purpose, the parameter to use is: `facility_diversity_level = N` 

Example: 

```
"facility: \['sjc1', 'ewr1', 'any'\]"
"facility\_diversity\_level = 1"
"quantity = 10”

SJC1: 7 available
EWR1: 24 available
DFW1: 50 available
=> 10 deployed to EWR1
```
  

Another example, with larger batch request: 

```"facility\_diversity\_level = 2" with "quantity = 25"

SJC1: 7 available
EWR1: 24 available
DFW1: 50 available
=> 7 deployed to SJC1, 18 deployed to EWR1
```

If this parameter is not specified, we don't enforce any limit and device provisioning could be spread across 1 or 2 or all facilities.

### **Naming Scheme: Series vs Custom**

In terms of hostnames, you can handle this in two different ways:

*   **Series**:  You can create a parseable hostname, `"hostname":"s{{index}}.blah.com"`  where`{{index}}`  will be replaced during creation in a logical order (e.g. 1, 2, 3).
*   **Hostname**: You can pass the API an array of hostnames to use.


### **Checking the Status of Batch Deployments**

There are four states you can see: 

*   queued
*   in\_progress
*   completed
*   failed 

A batch deployment starts as ‘queued’ once it is requested.  At this stage our worker will begin to work on validations & creations. 

Once it passes validation, it will move to ‘in\_progress’.  

If there are devices to fulfill the batch request(s), it will move to ‘completed’. 

If for some reason we are unable to create all the devices, the batch request will be marked as ‘failed’ and you will be able to see why in `‘error_messages’`  returned by the API.

###   

### **Using Batch Deployment with Spot Market**

We actually created batch deployments while developing our [Spot Market](https://support.packet.com/kb/articles/spot-market) feature, as we need to validate the prices / availability in batches before each spot instance is deployed.