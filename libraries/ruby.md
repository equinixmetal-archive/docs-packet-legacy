<!-- <meta>
{
    "title":"Ruby",
    "description":"An official Ruby client for the Packet API",
    "author":"Zalkar Ziiaidin",
    "github":"zalkar-z",
    "date": "2019/12/11",
    "tag":["Ruby", "CLI"]
}
</meta> -->

![Packet Ruby API Client Banner](/images/libraries/ruby/ruby-banner.png)

Welcome to [Packet Ruby API Client](https://github.com/packethost/packet-rb).

### Installation

```
gem install packethost
```

## Configuration

You can either configure the library in a global way (easier):

```
Packet.configure do |config|
  config.auth_token = 'my_token'
end
```

or create and use an individual instance of `Packet::Client` (more complex):

```
Packet::Client.new(auth_token)
```

Generally speaking, you'll probably want to configure it globally if you only ever use a single API token.

## Usage

If you configured the library globally, you can just call methods on the `Packet` module. For example:

```
Packet.list_projects
=> [#<Packet::Project>, #<Packet::Project>]
```

If you configured a `Packet::Client` manually, you can call those same methods on the client itself:

```
client = Packet::Client.new( ... )
client.list_projects
=> [#<Packet::Project>, #<Packet::Project>]
```

See a list of [available methods](https://github.com/packethost/packet-rb/tree/master/lib/packet/client).

For more information, please visit [Packet Ruby CLI public repo](https://github.com/packethost/packet-rb).

