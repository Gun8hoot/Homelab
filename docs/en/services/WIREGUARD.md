<div align="center">
	<h1>WireGuard</h1>
</div>

WireGuard is a modern, minimal VPN protocol and server. It lets me securely access all my homelab services when I'm not at home: the phone or laptop connects to the Pi, gets an IP inside the VPN subnet, and can then reach every `*.homelab.lan` subdomain as if it were on my LAN.

<div align="center">
	<h2>Configuration</h2>
</div>

```yaml
  wireguard:
    image: lscr.io/linuxserver/wireguard:latest
    container_name: homelab-wireguard
    cap_add:
      - NET_ADMIN
      - SYS_MODULE #optional
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Europe/Paris
      - SERVERPORT=16382 #optional
      - PEERS=2 #optional
      - PEERDNS=auto #optional
      - INTERNAL_SUBNET=10.13.13.0 #optional
      - ALLOWEDIPS=0.0.0.0/0 #optional
      - LOG_CONFS=true #optional
    volumes:
      - ${VOLUMES_LOCATION}/wireguard:/config
      - /lib/modules:/lib/modules #optional
    ports:
      - 16382:16382/udp
    sysctls:
      - net.ipv4.conf.all.src_valid_mark=1
    restart: unless-stopped
```

`cap_add: NET_ADMIN / SYS_MODULE` : WireGuard needs to create network interfaces and load kernel modules, which requires extra privileges a normal container doesn't have<br>
`SERVERPORT=16382` : The UDP port the VPN listens on — the only port WireGuard exposes on the host<br>
`PEERS=2` : The server generates two client configs at first start (one per device I take outside)<br>
`INTERNAL_SUBNET=10.13.13.0` : The subnet assigned to VPN clients<br>
`ALLOWEDIPS=0.0.0.0/0` : Clients route *all* their traffic through the tunnel (full tunnel). Restricting it to the LAN subnets would make a split-tunnel instead<br>
`volumes:` : `/config` holds the server keys and generated peer configs under `${VOLUMES_LOCATION}/wireguard`. Regenerating this folder means re-distributing client configs, so it persists<br>
`sysctls` : `src_valid_mark` is required by the WireGuard kernel interface<br>
`restart: unless-stopped` : The container restarts automatically after a crash or a reboot<br>

<div align="center">
	<h2>Usage</h2>
</div>

At first start, the container generates the server keys and one config file per peer under `${VOLUMES_LOCATION}/wireguard/peer*`. With `LOG_CONFS=true`, each peer's QR code is printed in the container logs:

```bash
make logs | grep -A 20 "peer1"
```

Scanning the QR code with the official WireGuard mobile app (or importing the `.conf` file on a laptop) is enough to connect.

<h2>Notes</h2>

- Only the VPN port (16382/UDP) is published; once inside the tunnel, I resolve names through Pi-hole and reach services exactly like a LAN device.
- There is also an [OpenVPN client container](../../../config/network/openvpn-client/docker-compose.yaml) in `config/network/` for the opposite use case: routing *outbound* traffic of specific containers through a commercial VPN.
