<div align="center">
	<h1>Asus gaming laptop</h1>
</div>

- This computer is an Asus gaming laptop. It has an Intel i5, 8GB of DDR3 RAM and an NVIDIA GTX 760M.
- The OS that runs on the device is **Debian** (Proxmox VE uses Debian under the hood), but you also have a **Proxmox server** on it, used to create and manage virtual machines.
- It is the most "powerful" machine of my homelab — in quotes, because it has some overheating issues. To avoid crashes, I've undervolted the CPU.

<div align="center">
	<h2>Proxmox VE</h2>
</div>

Proxmox VE is an open-source virtualization platform based on Debian. It provides a web interface to create and manage virtual machines (KVM) and lightweight containers (LXC), with features like snapshots, templates, and clustering that mirror what you'd find on professional hypervisors like VMware ESXi.

Since this laptop is the most "powerful" machine of my homelab, I use it to run the workloads that need more resources or isolation than the Raspberry Pi can provide:

- **REMnux**: A Linux distribution (based on Ubuntu) built for reverse engineering and malware analysis. It comes preloaded with tools for inspecting suspicious files and network traffic, which makes it a good fit for a virtual machine kept isolated from the rest of the network.
- **Debian guest**: A simple Debian virtual machine, used for testing and experiments without risking my main machines.
- **Windows guest with FlareVM**: A Windows VM with every FlareVM package already installed to do dynamic analysis on a program. It stays fully isolated (no shared folders, internet only through a controlled virtual network) so analyzed malware can't reach my homelab.

The Proxmox web interface itself is reachable through my homelab's NGINX reverse proxy at `https://proxmox.homelab.lan` (see the matching [server block](../../../config/network/nginx/files/site-availables/proxmox.conf) and the `PROXMOX_IP` / `PROXMOX_PORT` variables in [`config/.env.template`](../../../config/.env.template)).

<h2>Notes</h2>

- Running a hypervisor on consumer laptop hardware works, but thermal throttling is real: long VM sessions heat up the machine quickly, so I keep the lid open for better airflow.
- The CPU is undervolted to reduce the heat output — since then the crashes caused by overheating have disappeared.
- Snapshots before every experiment are a must — it takes seconds and lets me roll back a VM that a malware sample (or a bad config change) has broken.
