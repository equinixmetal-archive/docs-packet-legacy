<!-- <meta>
{
    "title":"Organizations, Users and Projects",
    "description":"An overview of Packet's data model.",
    "tag":["organizations", "accounts", "platform"],
    "seo-title": "An overview of Packet's data model including organizations, team users, and projects.",
    "seo-description": "An overview of Packet's data model.",
    "og-title": "An overview of Packet's data model including organizations, team users, and projects.",
    "og-description": "Learn more about Packet and get started!",
    "og-image": "/images/packet-product-docs.png"
}
</meta> -->

Similar to popular developer platforms like GitHub, Packet leverages a flexible data model based around users. In addition to users, we also have projects and organizations.

In order to deploy infrastructure, users must belong to an organization, which is a billing entity that sits one level above users. There are two types of organizations:
* __Personal__ organizations are meant for individuals  (e.g. personal servers, example projects, or test integrations.)
* __Company__ organizations are tied to a corporate entity and typically involve multiple projects and several collaborators.

Just like at GitHub, you can create or belong to many organizations at once.

### Projects

Within an organization, users can create projects (e.g. "Staging" and "Production") to logically group infrastructure and to enable certain networking features like backend transfer.

For auditing purposes, each project results in a distinct invoice on the 1st of the month. As such, be sure that your automation doesn't create a new project when it isn't needed — instead, just reuse a single project.

### Team Members and Roles

Each organization has a primary owner, who is ultimately responsible for all activity in an organization.  Additional team members can be added with the following permissions:

* __Admin__ - this role is will have full control over the account.
* __Collaborator__ -  will have access to project specific resources.
* __Billing__ - will have access to the billing portion of the account.

### Adding Members to an Organization

If you are an Owner or an Admin, you can invite new users via the `User Icon > Team > Invite New Member`.

 You are able to add a single member or multiples at once. Each email added, will receive an automated response from our platform with a verification link (to either accept/deny) the invitation.

![organization settings](/images/organizations/add-members.png)
