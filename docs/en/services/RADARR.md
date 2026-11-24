<div align="center">
	<h1>Radarr</h1>
</div>

Radarr is an automated movie library manager. You add a movie to your watchlist, and Radarr monitors indexers (through Prowlarr) for a release matching your quality profile, sends it to qBittorrent, and moves/renames the finished file into the movies folder with proper naming and metadata. It is reachable at `https://radarr.homelab.lan`.

<div align="center">
	<h2>Configuration</h2>
</div>

```yaml
  radarr:
    image: lscr.io/linuxserver/radarr:latest
    container_name: homelab-radarr
    ports:
      - ${RADARR_PORT}:${RADARR_PORT}
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=${TIMEZONE}
    volumes:
      - ${VOLUMES_LOCATION}/radarr:/config
      - ${MEDIA_DIRECTORY_LOCATION}/${MEDIA_MOVIE_DIRECTORY_NAME}:/movies
    restart: unless-stopped
    networks:
      - nginx_network
      - network_access
```

`ports:` : The web UI port, routed by NGINX at `https://radarr.homelab.lan`<br>
`volumes:` : Config under `${VOLUMES_LOCATION}/radarr`, and the movies directory mounted at `/movies` — the destination Radarr moves finished downloads into<br>
`PUID/PGID` : Files it moves are written with my host user's ownership<br>
`networks:` : `nginx_network` for the reverse proxy and `network_access` to reach Prowlarr and qBittorrent by their Docker DNS names<br>
`restart: unless-stopped` : The container restarts automatically after a crash or a reboot<br>

<div align="center">
	<h2>Usage</h2>
</div>

After the setup wizard: **Settings < Download Clients** to add qBittorrent (host `qbittorrent`, port from the `.env` file), and **Settings < Indexers** to add Prowlarr. Then add a movie, pick a quality profile, and Radarr handles the rest.

<h2>Notes</h2>

- Radarr only *manages* downloads: it needs qBittorrent running to actually fetch, and Prowlarr to know where to look.
- The movies directory is the same folder Jellyfin indexes, so a downloaded movie appears in Jellyfin automatically once imported.
