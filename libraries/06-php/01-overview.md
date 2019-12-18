<!-- <meta>
{
    "title":"PHP",
    "slug":"php",
    "description":"An official PHP client for the Packet API",
    "author":"Zalkar Ziiaidin",
    "github":"zalkar-z",
    "date": "2019/12/11",
    "tag":["PHP", "CLI"]
}
</meta> -->

Welcome to [Packet PHP API Client](https://github.com/packethost/packet-php).	

For more information about our API endpoints, please visit our [API Documentation](https://www.packet.com/developers/api/).

## Install with Composer

```
"require": {
    "packethost/packet": "dev-master"
},
```

## Usage

```
<?php

require __DIR__ . '/vendor/autoload.php';

//Create a configuration object
$config = new PacketHost\Client\Adapter\Configuration\DefaultConfiguration(
    'YOUR_API_KEY'
);

//Build the adapter and Api
$adapter = new PacketHost\Client\Adapter\GuzzleAdapter($config);
$api = new PacketHost\Client\PacketApi($adapter);

//Create options array with request params
$options = [
    'queryParams' => 'per_page=20'
];

// Fetching projects
$projects = $api->project()->getAll($params);
var_dump($projects);

// Fetching facilities
$facilities = $api->facility()->getAll();

// Fetching Operating Systems
$oses = $api->operatingSystem()->getAll();

// Fetching Plans
$plans = $api->plan()->getAll();

// Creating a device
$device = new \PacketHost\Client\Domain\Device();

$projectId = 'PROJECT_ID';

$device->hostname = 'sample';
$device->facility = $facilities[0]->code;
$device->plan = $plans[0]->slug;
$device->operatingSystem = $oses[0]->slug;

$device = $api->device()->create($projectId, $device);

var_dump($device);

```

## Routes & Methods

For more information on available router and methods, please visit [Packet PHP CLI public repo](https://github.com/packethost/packet-php).

