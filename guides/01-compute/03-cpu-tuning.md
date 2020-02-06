<!-- <meta>
{
    "title": "CPU Tuning",
    "description": "Tips for fine tuning the CPU to improve performance",
    "tag": ["CPU", "Tuning", "Processor", "Performance"],
    "seo-title": "Introduction to CPU Tuning - Packet Technical Guides",
    "seo-description": "Tips for fine tuning the CPU to improve performance",
    "og-title": "CPU Tuning",
    "og-description": "Tips for fine tuning the CPU to improve performance"
}
</meta> -->


Packet is committed to help our users get the most out of their infrastructure.  Unlike with virtualized clouds (AWS, GCE, etc) with a dedicated server at Packet you can really dive into the guts of server tuning. Each workload is different, so our recommendation is to take incremental steps and measure your progress.

Without further ado, here are some tips and tricks to help you work with common CPU settings for potential improvements on some of our x86 server types:

### c1.small.x86

The E3-1240 v5 chip that powers our c1.small.x86 comes with something called SpeedStep technology that allows the system to scale the frequency based on the current workload.

To see the current CPU frequency governors that are currently in use:
```
cat /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor
```
The above output will likely return eight lines of 'powersave'. To verify clock speed, install the following tool:
```
apt-get install cpufrequtils
```
Once installed run `cpufreq-info` to determine the current clock speed. To have the systems running at their maximum clock speed:
```
echo performance > /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor
```
Do this for all 8-CPUs. Replace cpu0  with cpu1 , cpu2 , up to  cpu7 . To confirm you have applied this correctly, you can run the same command to print out the current scaling governor:
```
cat /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor
```
This should now print 8 lines of performance. You may also run cpufreq-info again to confirm the current clock speed is what you were expecting.

To make this permanent after reboot, add/edit: GOVERNOR="performance" in /etc/init.d/cpufrequtils

### m1.xlarge.x86 / s1.large.x86

The m1.xlarge & s1.large servers are powered by dual E5-2650 v4 processors, and as such the CPU frequency driver is intel_pstate, not cpufreq. Because of this, you will experience different outcomes with the same CPU frequency governor due to the governor being implemented by the driver.

You will not be able to set the CPU frequency directly for this reason from our friends at kernel.org:

For contemporary Intel processors, the frequency is controlled by the processor itself & the P-State exposed to software is related to performance levels. The idea that frequency can be set to a single frequency is fictional for Intel Core processors. Even if the scaling driver selects a single P-State, the actual frequency the processor will run at is selected by the processor itself.

Do not fear, you're not out of luck! With a few tools, you can increase your server's performance:
```
apt-get install linux-tools-common linux-tools-4.4.0-77-generic git
git clone https://github.com/pyamsoft/pstate-frequency.git
cd pstate-frequency
make install
pstate-frequency -S --plan max
```
This will configure P-state to its maximum values. From there, you can run:
```
watch -n 1 "cpufreq-info | grep 'current CPU'"
```
As you put more load on the system the CPU frequencies will dynamically scale up to their maximum values.

**WARNING:** the next section is for advanced users only.

If the processors are not scaling up fast enough based on your usage pattern, you can also tweak the `intel_pstate`  settings in `/sys/kernel/debug/pstate_snb/`
```
deadband
d_gain_pct
i_gain_pct
p_gain_pct
sample_rate_ms
setpoint
```
The default sample rate is ten milliseconds, and the default setpoint is 97. If you're finding that the default dynamic frequency scaling isn't fast enough, we would recommend reducing the sample rate a bit & reducing the setpoint further, again from our friends at kernel.org.

For the same load at setpoint = 60, this will result in the next P-State = 0x08 - ((60 - 100) * 0.2) = 16. So by changing the setpoint from 97 to 60, there is an increase of the next P-State from 9 to 16. So this will make processor execute at higher P-State for the same CPU load. If the load continues to be more than the setpoint during next sample intervals, then P-State will go up again till the maximum P-State is reached. But the ramp up time to reach the maximum P-Stat will be much faster when the setpoint is 60 compared to 97.

As these are extremely low level settings directly affecting how the CPU handles power and performance, we would highly recommend not jumping straight to sample_rate_ms = 1  and setpoint = 1 . Instead slowly step your way into the right values based on heuristics of your app.
