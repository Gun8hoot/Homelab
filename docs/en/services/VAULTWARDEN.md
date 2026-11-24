<div align="center">
	<h1>Vaultwarden</h1>
</div>

Vaultwarden is a lightweight, self-hosted, unofficial implementation of the Bitwarden server API. It lets me self-host my password manager while still using the official Bitwarden clients (browser extensions and mobile apps), which simply point at my server instead of Bitwarden's cloud.

<div align="center">
	<h2>Configuration</h2>
</div>

```yaml
  vaultwarden:
    image: vaultwarden/server:latest
    container_name: homelab-vaultwarden
    restart: unless-stopped
    environment:
      DOMAIN: "https://vault.homelab.lan"
    volumes:
      - ${VOLUMES_LOCATION}/vaultwarden:/data/
    networks:
      - nginx_network
```

`image: vaultwarden/server:latest` : The official Vaultwarden image from Docker Hub<br>
`environment: DOMAIN` : Tells Vaultwarden which base URL clients will use. Setting it to `https://vault.homelab.lan` is important so websockets and attachments generate correct links<br>
`volumes:` : The entire Vaultwarden state (encrypted vault database, attachments, icons cache) lives under `${VOLUMES_LOCATION}/vaultwarden`, mounted at `/data`. Losing this folder means losing the vault, so it's the volume that matters most on the Pi<br>
`networks:` : Vaultwarden sits on `nginx_network` only — it has no reason to talk to other services, and never publishes a port on the host. Everything goes through NGINX at `https://vault.homelab.lan`<br>
`restart: unless-stopped` : The container restarts automatically after a crash or a reboot<br>

<div align="center">
	<h2>Usage</h2>
</div>

Once the container is up, browse to `https://vault.homelab.lan` and create an account. Then, in the official Bitwarden clients:

1. Open the client settings, **Self-hosted** section.
2. Set the server URL to `https://vault.homelab.lan`.
3. Log in with the account created above.

Admin tasks (invites, diagnostics, backups config) are done on `https://vault.homelab.lan/admin`, which is disabled unless an `ADMIN_TOKEN` environment variable is set.

<h2>Notes</h2>

- Bitwarden clients require HTTPS: without the TLS termination done by NGINX (see [NGINX](./NGINX.md)), the apps refuse to connect.
- Backups of the `${VOLUMES_LOCATION}/vaultwarden` folder are critical — it contains the only copy of every credential.
