<div align="center">
	<h1>OpenVPN client</h1>
</div>

The OpenVPN client container is the reverse of [WireGuard](./WIREGUARD.md): instead of letting me connect into the homelab from outside, it routes the *outbound* traffic of chosen containers through a commercial VPN. Any container sharing its network namespace (`network_mode: service:vpn`) exits the homelab with the VPN's IP instead of my home IP.

<div align="center">
	<h2>Configuration</h2>
</div>

```yaml
  vpn:
    container_name: homelab-vpn-client
    image: dperson/openvpn-client:latest
    cap_add:
      - net_admin
    restart: unless-stopped
    volumes:
      - /dev/net/tun:/dev/net/tun
      - ./vpn-config:/vpn
    security_opt:
      - label:disable
    ports:
      - 8001:8001
      - 8002:8002
      - 8003:8003
    networks:
      - bridge_vpn
    entrypoint: ["/sbin/tini", "--", "/usr/bin/openvpn.sh", "-d"]
```

`cap_add: net_admin` : Required to create the tunnel interface inside the container<br>
`volumes:` : `/dev/net/tun` is the kernel tunnel device, and `./vpn-config` holds the `.ovpn` config file plus credentials of the VPN provider<br>
`ports: 8001-8003` : Ports of services that should be reachable *through* the tunnel, published here because the client container owns the shared network namespace<br>
`networks: bridge_vpn` : A dedicated bridge so containers using this VPN egress are isolated from the rest of the stack<br>
`entrypoint` : The image's helper script starts the tunnel and, with `-d`, keeps it in the foreground<br>

<div align="center">
	<h2>Usage</h2>
</div>

To make another service use the tunnel, attach it to the client's network instead of a normal one:

```yaml
  myservice:
    network_mode: "service:vpn"   # instead of networks:
```

That service then has no network of its own — all its traffic goes through the VPN.

<h2>Notes</h2>

- With a single shared namespace, only the client publishes ports; a service behind it is reached through the `800x` port mappings.
- If the tunnel dies, the attached containers lose connectivity entirely — a killswitch by design, which is exactly what you want for privacy-sensitive egress.
