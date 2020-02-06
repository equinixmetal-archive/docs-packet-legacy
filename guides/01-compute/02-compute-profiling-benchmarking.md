<!-- <meta>
{
    "title": "Compute Profiling and Benchmarking",
    "description": "Benchmarking Tools for Linux",
    "tag": ["CPU", "Compute", "Profiling", "Beanchmarking"],
    "seo-title": "Compute Profiling & Benchmarking - Packet Technical Guides",
    "seo-description": "Benchmarking Tools for Linux",
    "og-title": "Modern Compute Profiling and Benchmarking",
    "og-description": "Benchmarking Tools for Linux"
}
</meta> -->


# Modern Compute Profiling and Benchmarking Tools for Linux

In a bare-metal environment, whether your end goal is to run virtual machines, containers, or just a flat workload on the machines and its network, profiling and benchmarking peformance is important to ensure your storage is fast, network is reliable, and computing resources are giving you what you’d expect. 

Linux has many tools, some old and some new, taking advantage of the newer features in the kernel to enhance scope of debuggability, others inherited from other ecosystems and finally ported to Linux. 

## `perf`

The `perf` tool provides a coherent interface for different CPU architectures you may be running your systems on top of to run tests like: a wide array of general peformance benchmarks, more targetted profiles of specific commands, testing the behavior of the scheduler, or even the profile of a KVM guest (a virtual machine) running on your host.

The `perf list` subcommand provides a list of event types for use with the tool that are classed as either hardware (i.e. `cpu-loads`, `cache-misses`), or software events (i.e. `page-faults`) and tracepoint events. A common usage examplewhen run with another command, will provide a profile of these supported events while that command is run:

```
perf stat -B ${your command}
```

or using the `-e` flag to specify which events to count:

```
perf stat -e cycles ${your command}
```

To monitor these events at different privilege levels, using the following syntax, one can specify modifiers, for example, at the kernel level (`k`), user level (`u`), or for virtual machine profiles, at the hypervisor (`h` or `H` for host events) or inside a guest VM (`G`):

```
perf stat -e event:modifier
```
 
Perf also has built-in capabilities for generating visualization, and can be exported for use with [FlameGraphs](http://www.brendangregg.com/perf.html#Visualizations) for visualizing this profile data. 

## `dtrace`

Originally introduced in Solaris 10, `dtrace` has since been ported to many other platforms (Linux, the BSDs, OS X, even Windows), and is a comprehensive, highly programmable (dynamic) suite of tracing utilities.

`dtrace` uses a `provider:module:function:name` format to specify probes for tracing and operating on a given process or function, and fields can be ommitted to expand the scope of the probe, so for example, in the following command:

```
dtrace -n 'syscall:::entry { @num[execname] = count(); }'
```

where we're counting executions of a `count()` syscall function, fields are omitted `:::` to include any module that might make such an execution attempt, or, for example, to check for a specific syscall within a specific process:

```
pid$1:*:*malloc*:entry
```

which can be used to base the rest of your `dtrace` script around, or turn into a series of repeatable [one-liners](http://www.brendangregg.com/dtrace.html#OneLiners).

## eBPF/cBPF-based Tooling & Tracing

Extended BPF (eBPF) adds additional functionality to classical BPF, which can be used for tracing operations like attaching a filter onto a socket, and then filtering traffic through that socket, which in eBPF, can be used to assist in aggregation and metrics collection, but because programming eBPF directly isn't entirely accessible, there are many frontend tools that assist in building such eBPF programs, or can further extend this functionality of other tracing tools.

Some examples of eBPF-based tools to trace different types of activity are: 

- `tcplife` to show completed TCP sessions, their process ID, and the command associated.
- `bpftrace`, like the `dtrace` examples above, can be used to trace specific functions or systemcalls and enumerate them, and built into a suite of [one-liners](http://www.brendangregg.com/ebpf.html#bpftrace). The syntax is similar to other examples, `bpftrace -e 'tracepoint:$probe:$syscall { ... }'`, to specify what to trace, and what do with that input. 
- `bcc` is the BPF Compiler Collection, which makes writing (e)BPF programs easier to write, using front-ends written in languages like Python and Lua. There are many examples implementing [common uses cases](https://github.com/iovisor/bcc/tree/0267b4840ba2881583e075bf552e2837f1646042/examples) for these packages in scripting language contexts.

and even be used to extend the capability of [tools like the `perf` command](http://www.brendangregg.com/perf.html#eBPF).

## Additional Resources

- Some additional practical examples for [perf](https://perf.wiki.kernel.org/index.php/Tutorial).
- [dtrace by example](https://www.oracle.com/technetwork/server-storage/solaris/dtrace-tutorial-142317.html)
- [DTrace Tools](http://www.brendangregg.com/dtrace.html)
- [Linux BPF Tracing tools](http://www.brendangregg.com/ebpf.html)
