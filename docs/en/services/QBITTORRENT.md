<div align="center">
	<h1>qBittorrent</h1>
</div>

qBittorrent is a torrent client with a web UI. In my stack it is the download engine: the *arr applications (Radarr, Sonarr) push torrent files to it through its API, and it downloads them straight into the shared media directory. It is reachable at `https://qbit.homelab.lan`.

<div align="center">
	<h2>Configuration</h2>
</div>

```yaml
  qbittorrent:
    image: lscr.io/linuxserver/qbittorrent:latest
    container_name: homelab-qbittorrent
    ports:
      - ${QBITTORRENT_WEB_PORT}:${QBITTORRENT_WEB_PORT}/tcp
      - ${QBITTORRENT_TORRENT_PORT}:${QBITTORRENT_TORRENT_PORT}
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=${TIMEZONE}
      - WEBUI_PORT=${QBITTORRENT_WEB_PORT}
      - TORRENTING_PORT=${QBITTORRENT_TORRENT_PORT}
    volumes:
      - ${VOLUMES_LOCATION}/qbitorrent:/config
      - ${MEDIA_DIRECTORY_LOCATION}:/downloads
    stop_grace_period: "10s"
    restart: unless-stopped
    networks:
      - nginx_network
      - network_access
```

`ports:` : The web UI port (routed by NGINX) and the torrenting port for incoming peer connections — both defined in the [`.env` file](../../../config/.env.template)<br>
`WEBUI_PORT / TORRENTING_PORT` : The environment variables make qBittorrent listen exactly on the ports published above<br>
`volumes:` : Config under `${VOLUMES_LOCATION}/qbitorrent`, and the media directory mounted at `/downloads` so finished downloads land directly where Jellyfin and the *arr apps expect them<br>
`stop_grace_period: "10s"` : Gives qBittorrent ten seconds to cleanly close torrents and save its state before the container is killed<br>
`PUID/PGID` : Files land on the host with my user's ownership<br>
`restart: unless-stopped` : The container restarts automatically after a crash or a reboot<br>

<div align="center">
	<h2>Usage</h2>
</div>

Browse to `https://qbit.homelab.lan`. On first start the LinuxServer image prints a temporary admin password in the logs (`make logs`), which is then changed in the web UI. In **Settings < Web UI**, the *arr apps authenticate with a bypass account for API access.

<h2>Notes</h2>

- The web UI password should be set immediately — the temporary one is only shown once in the logs.
- A graceful stop matters with torrents: killing the container mid-write can corrupt the partial download state (hence the `stop_grace_period`).
