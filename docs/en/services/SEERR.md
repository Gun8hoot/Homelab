<div align="center">
	<h1>Jellyseerr</h1>
</div>

Jellyseerr is a request management tool for the media stack: users browse a Netflix-style catalog, click "request", and the request flows automatically into Radarr (movies) or Sonarr (shows), which then download and import the media. No manual downloading, no nagging the admin. It is reachable at `https://seerr.homelab.lan`.

<div align="center">
	<h2>Configuration</h2>
</div>

```yaml
  seerr:
    image: ghcr.io/seerr-team/seerr:latest
    init: true
    container_name: homelab-seerr
    environment:
      - LOG_LEVEL=debug
      - TZ=${TIMEZONE}
    ports:
      - ${SEERR_PORT}:${SEERR_PORT}
    volumes:
      - ${VOLUMES_LOCATION}/seerr:/app/config
    healthcheck:
      test: wget --no-verbose --tries=1 --spider http://localhost:5055/api/v1/settings/public || exit 1
      start_period: 20s
      timeout: 3s
      interval: 15s
      retries: 3
    security_opt:
      - no-new-privileges
    cap_drop:
      - ALL
    restart: unless-stopped
    networks:
      - nginx_network
      - network_access
```

`init: true` : Lets Docker forward signals and reap zombies properly inside the container<br>
`healthcheck:` : Probes the public settings API to mark the container healthy only when the web app truly answers — with a `start_period` grace window for first boot<br>
`security_opt: no-new-privileges` + `cap_drop: ALL` : Drops every Linux capability and forbids privilege escalation: the web app doesn't need anything more, so it runs as locked-down as possible<br>
`volumes:` : Its own config (users, requests, settings) lives under `${VOLUMES_LOCATION}/seerr`<br>
`ports:` : The web UI port, routed by NGINX at `https://seerr.homelab.lan`<br>
`networks:` : `nginx_network` for the reverse proxy, `network_access` to talk to Jellyfin, Radarr and Sonarr<br>

<div align="center">
	<h2>Usage</h2>
</div>

The setup wizard asks for the Jellyfin, Radarr and Sonarr API keys (found in each app's settings). Once connected, Jellyseerr mirrors the existing library, users sign in with their Jellyfin accounts, and requests land in the right app automatically.

<h2>Notes</h2>

- Jellyseerr is the hardened service of the stack (`no-new-privileges`, `cap_drop: ALL`, healthcheck) — the LinuxServer images above could deserve the same treatment.
- If a requested item never appears, check Radarr/Sonarr first: Jellyseerr only forwards requests, it doesn't download anything itself.
