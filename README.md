<div align="center">
	<h1>Homelab</h1>
	<a href="./FR_README.md"><p>🇫🇷 • French version</p></a>
</div>

This repository is a dedicated to explain what compose my homelab and how i have do it. But before starting you will problably ask me, "What is a homelab". An homelab is like an infrastructure that we can find on the real world. It is often use to learn and experiment on real devices. Every services that run on your homelab is here because you decide to add and configure it. My homelab is a little "crappy" because ive take what i have at home without paying a single euros in additionnal hardware. My homelab is compose by two device:
1. A Rasberry Pi 3B
	- A Raspberry Pi is a small, affordable computer about the size of a credit card. It uses little electricity and can run a full operating system, just like a regular computer. People use it to learn programming, build projects, and run simple servers or other embedded systems.
	- My Raspberry Pi runs Alpine Linux instead of Raspberry Pi OS (formerly Raspbian). Since the Pi has limited resources, I chose Alpine because it’s lightweight and helps keep resource usage low.
	- To avoid as much as possible overheating probleme, I have put a heat-sink getted from an old TV decoder on the CPU to disperse the heat produce by it. With this little upgrade my ive lose 20% degree on a full use with every core at 100 percent

	<div align="center">
		<img src="./assets/hardware_pics/rasberry_pi.jpg">
		<p><it>Picture of my Rasberry Pi</it></p>
	</div>
	<div align="center">
		<img src="./assets/hardware_pics/rasberry_pi_fastfetch.jpg">
		<p><it>A fastfetch of my Rasberry Pi</it></p>
	</div>

2. A MSI laptop
	- This computer is a MSI (ahhh forget the ref). It have an Intel I5, 8Gb of RAM in DDR3 and have a NVIDIA GTX 760m
	- The operating system that run on it is Proxmox VE (Virtual Environment). It's used to create virtual machines 

<div align="center">
	<h1>Rasberry Pi</h1>
</div>

Ive install Alpine instead of a simple Rasbian because my rasberry pi only have 1Gb of RAM so i needed to have the lightest operating who is possible with the minimal requirement. Also, i found that Alpine is more stable than Rasbian on my Rasberry PI. Since ive switch to Alpine ive done less troubleshooting.

Each services who run on this devices is containerized using docker container.
Here the list of services that run:
- Pi-hole : A DNS server who can blocked DNS request to adventising server and act like a simple DNS server
- Jellyfin : A streaming server
- Forgejo : An host localy and opensource alternative to Github
- Nginx : A simple reverse proxy that i olso use as a static server for my portal
- Kuma : An uptime manager that send me a discord message through a webhook if one of those services are done

<div align="center">
	<h1>MSI laptop</h1>
</div>
