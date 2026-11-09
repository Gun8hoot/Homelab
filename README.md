<div align="center">
    <h1>Homelab</h1>
</div>

To create my homelab i have: 
- A Rasberry Pi 3B+ who run Alpine
- A old MSI laptop with Proxmox

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


