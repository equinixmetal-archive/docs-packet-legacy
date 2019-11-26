<!--<meta>
{
    "title":"Packet Inventory",
    "description":"Learn more about Packet inventory",
    "date": "2019/11/26",
    "tag":["API", "Inventory"]
}
</meta>-->


As a Public Cloud, our goal is to provide a seamless "on demand" experience to all of our users.  However, since we do not virtualization our infrastructure and provide 100% dedicated machines to each user, capacity management is a more nuanced challenge for us.  While we aim to avoid any "out of capacity" errors, logistics and variations in demand can sometimes result in an inventory problem. Here are some strategies that we recommend each user to get familiar with:

*  Talk to Us - If you know you have an upcoming need for capacity, please be in touch with us via support@packet.com. We can help to advise you about the capacity situation, and work with you to help ensure a successful experience.

* Commitment / Reservations - If you have regular usage demands but are worried about price, we can discuss custom rates in exchange for commitments as part of a “mix” for your infrastructure portfolio.

* Capacity API Endpoint - While we don't disclose the exact number of servers available at each location, you can query the capacity endpoint on our Packet API to get a status on each server type per facility.

#### Using the Capacity API Endpoint

Upon sending a GET request to /capacity, it will return a list of facilities and plans (configurations) with the current capacity level for each. Capacity level responses will be one of the following:

* Normal - There's plenty of servers available.
* Limited - There are  servers available, but the stock is limited.  This varies based upon config - we generally have a lot more of our smaller instances, and fewer of our larger (more expensive) instances, so the "Limited" state can have a wide range.  Ping our support team to get more details.
* Unavailable - Uh-oh! All servers of a particular type + facility combination have been eaten up. Sorry about that! We'll definitely add more but you may want to try other server plan or facility.  Reach out to our support team to get details about incoming inventory.