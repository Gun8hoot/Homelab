<div align="center">
	<h1>Sonarr</h1>
</div>

Sonarr is an automated TV show library manager — the series counterpart of Radarr. Add a show, and it monitors indexers (through Prowlarr) for each missing episode, sends releases to qBittorrent, then moves and renames the finished files into the shows folder with consistent naming. It is reachable at `https://sonarr.homelab.lan`.

<div align="center">
	<h2>Configuration</h2>
</div>

```yaml
  sonarr:
    image: lscr.io/linuxserver/sonarr:latest
    container_name: homelab-sonarr
    ports:
      - ${SONARR}:${SONARR}
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=${TIMEZONE}
    volumes:
      - ${VOLUMES_LOCATION}/sonarr:/config
      - ${MEDIA_DIRECTORY_LOCATION}/${MEDIA_SHOW_DIRECTORY_NAME}:/tv
    restart: unless-stopped
    networks:
      - nginx_network
      - network_access
```

`ports:` : The web UI port, routed by NGINX at `https://sonarr.homelab.lan`<br>
`volumes:` : Config under `${VOLUMES_LOCATION}/sonarr`, and the shows directory mounted at `/tv` — the destination for imported episodes<br>
`PUID/PGID` : Files it imports are written with my host user's ownership<br>
`networks:` : `nginx_network` for the reverse proxy and `network_access` to reach Prowlarr and qBittorrent<br>
`restart: unless-stopped` : The container restarts automatically after a crash or a reboot<br>

<div align="center">
	<h2>Usage</h2>
</div>

Same setup as Radarr: **Settings < Download Clients** for qBittorrent, **Settings < Indexers** for Prowlarr, then add a series and choose whether to monitor the whole show, future episodes only, etc.

<h2>Notes</h2>

- Sonarr's real value is *season packs and upgrades*: when a better quality release appears (e.g. a new season in higher quality), it grabs it and replaces the old file automatically.
- The shows directory is the same folder Jellyfin indexes, so new episodes appear in Jellyfin as soon as they are imported.
