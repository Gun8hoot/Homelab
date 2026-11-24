<div align="center">
	<h1>Prowlarr</h1>
</div>

Prowlarr is an indexer manager. It keeps track of torrent indexers (sites listing releases) and syncs them automatically into the *arr applications (Radarr, Sonarr), so indexers are configured once here instead of in each app. It is reachable at `https://prowlarr.homelab.lan`.

<div align="center">
	<h2>Configuration</h2>
</div>

```yaml
  prowlarr:
    image: lscr.io/linuxserver/prowlarr:latest
    container_name: homelab-prowlarr
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=${TIMEZONE}
    volumes:
      - ${VOLUMES_LOCATION}/prowlarr:/config
    ports:
      - ${PROWLARR_PORT}:9696
    restart: unless-stopped
    networks:
      - network_access
```

`image: lscr.io/linuxserver/prowlarr:latest` : The LinuxServer.io image, the standard for the *arr family<br>
`PUID/PGID` : The container runs its process as my host user (1000:1000), so files it writes have correct ownership<br>
`volumes:` : All settings and indexer definitions live under `${VOLUMES_LOCATION}/prowlarr`, mounted at `/config`<br>
`ports:` : The web UI port, routed by NGINX at `https://prowlarr.homelab.lan`<br>
`networks:` : `network_access` only — Prowlarr talks to the other *arr apps over this network<br>
`restart: unless-stopped` : The container restarts automatically after a crash or a reboot<br>

<div align="center">
	<h2>Usage</h2>
</div>

In the web UI: **Indexers < Add Indexer** to declare each indexer, then **Settings < Applications** to connect Radarr and Sonarr (using their API keys). From that point, adding or updating an indexer in Prowlarr propagates to them automatically.

<h2>Notes</h2>

- Prowlarr can also test indexers periodically and alert when one breaks — useful since public indexers change often.
- It stays on `network_access` rather than `nginx_network` in my setup, so it is reachable container-to-container but not exposed as a subdomain unless needed.
