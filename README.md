<div align="center">
	<h1>Homelab</h1>
	<a href="./FR_README.md"><p>🇫🇷 • French version</p></a>
	<h2>Description</h2>
</div>

This repository documents what my homelab is made of and how I built it. My homelab is a bit "crappy" because I only used hardware I already had at home, without spending a single euro on additional equipment.

It is composed of:

- **Two laptops**, both running Debian. One of them also hosts a Proxmox VE instance.
- **A Raspberry Pi** running Alpine Linux.
- **One really old network switch.**
- **Ethernet cabling**: most of the cables are CAT 5E, except for the first laptop, which uses a CAT 6 cable.

<div align="center">
	<h2>What is a homelab?</h2>
</div>

A homelab is a small infrastructure, similar to what you would find in a professional environment, but built at home for services that are used every day or almost every day. It is often used to learn and experiment on real devices, and that is mainly why I built mine. Every service running on a homelab is there because you decided to install and configure it yourself.

This side project helps me learn a lot about:

- real-world networking, beyond simulators such as Cisco Packet Tracer and GNS3
- system administration across multiple devices
- infrastructure architecture
- virtualization, reverse proxying, DNS and VPN setups
- self-hosting and maintaining services over time

<div align="center">
	<h2>Summary</h2>
</div>

- [Raspberry Pi](./docs/en/RASPBERRY_PI.md) (Alpine Linux)
	- [NGINX](./docs/en/NGINX.md): The main reverse proxy. It routes incoming requests to every service on the backend, so each one is reachable through its own subdomain.
	- [Uptime Kuma](./docs/en/KUMA.md): A self-hosted monitoring tool that checks whether my services and domains are up. If one of them goes down, it sends me a message through a Matrix bot.
	- [Pi-hole](./docs/en/PIHOLE.md): A network-wide DNS sinkhole that blocks ads and trackers. It also lets me define local DNS records across my network.
	- [Vaultwarden](./docs/en/VAULTWARDEN.md): A lightweight, open-source, unofficial implementation of the Bitwarden server API. It lets me self-host my password manager and use the official Bitwarden clients.
	- [Landing page](./docs/en/LANDING_PAGE.md): A landing page displayed when accessing `https://homelab.lan` on my network. It lists links to every available subdomain.
	- [WireGuard](./docs/en/WIREGUARD.md): A VPN server that lets me securely access all my services when I'm not at home.
- [Old Asus gaming laptop](./docs/en/ASUS_LAPTOP.md) (Debian)
	- [Proxmox](./docs/en/PROXMOX.md): The virtualization platform used to run virtual machines on this laptop.
		- [REMNUX](./docs/en/REMNUX.md): A Linux distribution (based on Ubuntu) built for reverse engineering and malware analysis. It comes preloaded with tools for inspecting suspicious files and network traffic, which makes it a good fit for a virtual machine kept isolated from the rest of the network.
		- [Debian guest](./docs/en/DEBIAN_GUEST.md): A simple Debian virtual machine running inside Proxmox, used for testing and experiments.

<div align="center">
	<h2>What's next?</h2>
</div>

- Create an isolated network dedicated to my infrastructure, using VLANs or subnets, to protect the backend from attacks originating inside my own network.
- Buy better hardware, such as a more powerful computer and a better switch.
