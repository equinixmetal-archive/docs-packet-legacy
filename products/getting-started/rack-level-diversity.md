<!-- <meta>
{
    "title":"Rack Level Diversity",
    "description":"Learn more about Rack Level Diversity.",
    "tag":["Rack Level Diversity"],
    "seo-title": "Bare Metal Cloud Data Centers -- Packet Developer Docs",
    "seo-description": "Learn more about our legal terms",
    "og-title": "Rack Level Diversity",
    "og-description": "Learn more about our legal terms"
}
</meta> -->
Packet offers single-tenant, dedicated servers in its cloud. This requires a more nuanced approach to diversity planning that involves switch pairs as points of failure (for redundancy we deploy a pair of switches per rack).

Depending on a variety of factors — including the size of each of our global facilities — servers may be available in multiple racks.

Although users are not able to query rack information in advance of a deploy, we do provide a Switch ID hash (in the Portal or via our API) as part of the details for any already-deployed instance. Each Switch ID hash represents a switch pair, which allows you to understand the diversity of your infrastructure.

If you are looking to achieve a certain diversity (or concentration) of infrastructure, these are your options:
On Demand: You can destroy and then provision another available server to achieve a particular setup. We cannot always provide the diversity.
Reserved: We can work with you to provide the needed setup, pending availability.



