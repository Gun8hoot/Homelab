
<div align="center">
	<h1>Rasberry Pi</h1>
</div>

- A Raspberry Pi is a small, affordable computer about the size of a credit card. It uses little electricity and can run a full operating system, just like a regular computer. People use it to learn programming, build projects, and run simple servers or other embedded systems.
- My Raspberry Pi runs Alpine Linux instead of Raspberry Pi OS (formerly Raspbian). Since the Pi has limited resources, I chose Alpine because it’s lightweight and helps keep resource usage low.
- To avoid as much as possible overheating probleme, I have put a heat-sink getted from an old TV decoder on the CPU to disperse the heat produce by it. With this little upgrade my ive lose 20% degree on a full use with every core at 100 percent
- You can found my entire Rasberry Pi configuration explaination : [here](./docs/en/RASBERRY.md) 

<br>
<div align="center">
	<img src="./assets/hardware_pics/rasberry_pi.jpg" width=300 height=500>
	<p><it>Picture of my Rasberry Pi</it></p>
</div>
<div align="center">
	<img src="./assets/hardware_pics/rasberry_pi_fastfetch.jpg" width=600 height=1000>
	<p><it>A fastfetch of my Rasberry Pi</it></p>
</div>

<h2>Services</h2>

- [Pihole](./docs/en/PIHOLE.md) : A DNS server who can blocked DNS request to adventising server and act like a simple DNS server
- [Jellyfin](./docs/en/jellyfin.md) : A streaming server
- [Forgejo](./docs/en/forgejo.md) : An host localy and opensource alternative to Github
- [Nginx](./docs/en/nginx.md) : A simple reverse proxy that i olso use as a static server for my portal
- [Kuma](./docs/en/KUMA.md) : An uptime manager that send me a message through a the matrix communication protocol if one of my subdomaine of my domain or one of my homelab services is down
