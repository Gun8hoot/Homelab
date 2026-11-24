<div align="center">
	<h1>Switch - Netgear GS716T</h1>
</div>

I bought this switch for around 20€ on a second-hand platform to replace my old unmanaged 10/100Mbps switch and finally get gigabit links between my devices. At the time of writing, it hasn't been delivered yet, so I can't give any hands-on opinion for now — this page will be completed with real feedback and pictures once it arrives.

<div align="center">
	<h1>Technical spec</h1>
</div>

The Netgear GS716T is a **smart managed**<sup>1</sup> switch: more capable than an unmanaged switch since it can be configured through a web interface, but simpler and cheaper than a fully managed one.

- **16 × 10/100/1000 Mbps** auto-sensing Gigabit Ethernet RJ45 ports, plus **2 dedicated SFP slots**<sup>2</sup> for optional fiber uplinks (they don't take away any copper port).
- **36 Gbps non-blocking**<sup>3</sup> switching capacity, store-and-forward<sup>4</sup>, 16K MAC address table<sup>5</sup>, jumbo frames<sup>6</sup> up to 9K.
- **L2+ features configurable through a web GUI**: IEEE 802.1Q VLANs<sup>7</sup>, link aggregation (LACP)<sup>8</sup>, spanning tree (STP/RSTP/MSTP)<sup>9</sup>, static routing<sup>10</sup>, IGMP snooping<sup>11</sup>, QoS (802.1p/DiffServ)<sup>12</sup>, ACLs<sup>13</sup>, 802.1x<sup>14</sup> port authentication, DHCP snooping<sup>15</sup>, broadcast storm control<sup>16</sup>, port mirroring<sup>17</sup> and cable diagnostics.
- **Fully silent fanless design** with an internal power supply (around 14W max) and Energy-Efficient Ethernet (IEEE 802.3az)<sup>18</sup>.
- **1U rack-mountable** metal chassis (43 × 440 × 204 mm, 2.57 kg), works just as well on a desk.
- Out of the box it gets an IP address through **DHCP** (fallback: `192.168.0.239`, default password `password`) and can be discovered with the Smart Control Center utility (or surelly using by using an ARP scanner like netdiscover).

> [!NOTE]
> The GS716T exists in three hardware revisions (v1, v2, v3). The specs above describe the **v3** (GS716T-300), the latest and most common one; older revisions differ slightly (combo SFP slots shared with copper ports, 8K MAC table, no static routing). Since I bought it second-hand, I'll check which revision I actually got once it arrives.

<div align="center">
	<h1>Images</h1>
	<img rel="PLACEHOLDER" src="">
	<p><i>placeholder</i></p>
</div>

<div align="center">
	<h1>Documents</h1>
</div>

- [Datasheet](../../../assets/pdfs/GS716Tv3_datasheet.pdf): the official NETGEAR datasheet for the GS716Tv3/GS724Tv4/GS748Tv5 series, with the full technical specifications.
- [Hardware installation guide](../../../assets/pdfs/GS716Tv3_installation_guide.pdf): how to physically install and power on the switch, plus a first-connection walkthrough.
- [Software administration manual](../../../assets/pdfs/GS716Tv3_software_administration_manual.pdf): the complete reference for the web management interface (VLANs, QoS, ACLs, SNMP, etc.).

<div align="center">
	<h1>Glossary</h1>
</div>

1. **Smart managed switch**: An unmanaged switch just forwards traffic and cannot be configured at all. A fully managed switch exposes an enterprise-grade CLI (and a price tag to match). A smart managed switch sits in between: it is configured through a simple web page and offers the features a small network actually needs (VLANs, QoS, monitoring, etc.) at a much lower price.
2. **SFP (Small Form-factor Pluggable)**: A standardized hot-swappable slot where you insert a fiber optic transceiver module. Fiber links can run far longer distances than copper Ethernet's 100m limit, which makes them useful for uplinks between buildings or floors. On the older revisions of this switch these slots were "combo" ports, meaning the fiber slot was shared with one of the copper ports — using fiber cost you a copper port.
3. **Non-blocking**: The switch's internal fabric is fast enough to forward the full theoretical bandwidth of every port at the same time — traffic never has to wait for the hardware.
4. **Store-and-forward**: A switching mode where the switch receives the entire Ethernet frame and checks it for errors before forwarding it. Corrupted frames are dropped instead of being passed along, keeping bad traffic out of the rest of the network.
5. **MAC address table**: The table a switch builds by learning which hardware (MAC) address lives behind which port, so each frame is forwarded only to the port leading to its destination instead of being sent everywhere. Its size (16K here) is how many devices the switch can remember at once.
6. **Jumbo frames**: Standard Ethernet frames carry at most ~1500 bytes of data. Jumbo frames allow much larger ones (up to 9000 bytes here), meaning fewer frames for the same amount of data, so less processing overhead for big transfers such as backups or file shares.
7. **VLAN (IEEE 802.1Q)**: Lets you cut one physical switch into several isolated logical networks. Devices in different VLANs cannot talk to each other even though they share the same hardware. IEEE 802.1Q is the standard way of "tagging" frames so that VLAN membership is preserved across switches.
8. **Link aggregation (LACP)**: Bundles several physical cables into one logical link for more bandwidth and/or redundancy — if one cable fails, traffic keeps flowing over the others. LACP is the protocol that negotiates and maintains the bundle automatically.
9. **Spanning tree (STP/RSTP/MSTP)**: When switches are cabled in a loop, Ethernet frames circulate forever and can bring the whole network down. Spanning tree detects loops and automatically disables the redundant links, keeping exactly one active path between switches. RSTP and MSTP are faster, more modern variants of the original STP.
10. **Static routing**: Lets the switch forward traffic between IP subnets based on manually configured routes, without needing a dedicated router — handy to make two VLANs talk to each other at full line speed.
11. **IGMP snooping**: Multicast traffic (one sender, many receivers — e.g. a video stream) is normally flooded to every port. IGMP snooping watches which devices actually subscribed to a stream and forwards it only to those ports.
12. **QoS (Quality of Service)**: Lets you mark some traffic (voice, video, etc.) as more important than the rest so a big download cannot make a call stutter. 802.1p and DiffServ (DSCP) are the two standard ways of marking and prioritizing traffic.
13. **ACL (Access Control List)**: Rules that define which traffic (based on MAC or IP addresses) is allowed or blocked — like a small built-in firewall at the switch level.
14. **802.1x (port authentication)**: A port does not pass any traffic until the device plugged into it proves who it is (username/password or certificate) against an authentication server. Prevents strangers from getting network access just by plugging a cable in.
15. **DHCP snooping**: Filters DHCP messages so that only trusted ports may offer IP addresses, blocking rogue or malicious DHCP servers from handing out addresses and hijacking traffic.
16. **Broadcast storm control**: A broadcast storm happens when broadcast traffic snowballs (often because of a loop) until it saturates the network. This feature caps the amount of broadcast traffic a port may generate and blocks what exceeds the limit.
17. **Port mirroring**: Copies all the traffic of one or several ports to a dedicated monitoring port, where it can be captured with a tool like Wireshark, without disturbing the original flow.
18. **Energy-Efficient Ethernet (IEEE 802.3az)**: The switch reduces power on links when they are idle, or when short cables do not need full transmit strength — meaningful savings for a device running 24/7.
