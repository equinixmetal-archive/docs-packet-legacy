<!--<meta>
{
    "title":"Overview",
    "description":"Learn more about compute classes and custom configurations.",
    "date": "09/20/2019",
    "tag":["Device Types", "Devices", "Compute Classes", "Custom Configurations"]
}
</meta>-->

#### What are Classes?

Classes are groupings derived from common use cases.  If you're an AWS user, this will seem pretty familiar.  Packet organizes servers into the following classes:

*   __Tiny (t)__ - Smaller instances, aimed at dev/test, controller nodes, etc.
*   __Compute (c)__ - Compute focused, with a modest RAM footprint.
*   __GPU (g)__ - GPU focused with  generous RAM
*   __Memory (m)__ - Memory heavy, with a generous RAM to core ratio.
*   __Network (n)__ - Focused on network use cases, such as ingress / load balancing.
*   __Storage (s)__ - Scale out boxes for storage scenarios.
*   __Accelerator (x)__ - FPGA and other specialty accelerator focused servers.

#### Server Naming Convention

All instances have a name that follows a formula to help you understand its purpose and broad specifications:  _class + generation + size + architecture (optional)_

By piecing these features together, we arrive at a name, such as c1.small.x86 - indicating a small compute class server, in its 1st generation with an x86 processor.  Since most of our systems are x86 currently, we'll provide nicknames so you can use "c1.small" for shorthand.

#### What are Generations?

Generations are updated when we significantly upgrade or change the components.  

This is usually around a major processor refresh, but often also relates to the underlying hardware configuration / chassis.  As such, a "1st" generation system is not necessarily outdated, it is simply our first iteration of a particular configuration.

#### What About Previous Server Names and API Calls?  

Packet previously labeled servers using Types, such as "Type 1" which was represented in the API as "baremetal_1".  

_These will still work_--we have simply made an alias in which baremetal_1 translates to its new name:  "c1.small.x86".  

However, new instances (such as our AMD configuration introduced in February, 2018) can only be accessed by the new class-based name or nickname.  In this case: "c2.medium.x86" or just "c2.medium" for short.

#### List of All Servers / Names

The following represents our current lineup of servers.  Previous names are mentioned in parentheses.  

---
__Tiny (t)__
* t1.small.x86

__Compute (c)__
* c1.small.x86
* c2.medium.x86
* c3.medium.x86
* c1.large.arm
* c2.large.arm
* c1.xlarge.x86
* c1.large.arm.xda

__GPU (g)__
* g2.large.x86

__Memory (m)__
* m1.xlarge.x86
* m2.xlarge.x86

__Network (n)__
* n2.xlarge.x86

__Storage (s)__
* s1.large.x86

__Accelerator (x)__
* x1.small.x86
* x2.xlarge.x86
