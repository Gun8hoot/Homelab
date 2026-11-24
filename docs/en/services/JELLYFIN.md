<div align="center">
	<h1>Jellyfin</h1>
</div>

Jellyfin is a free, self-hosted media streaming server. It indexes a media library, scrapes metadata and posters, and serves it to every device on my network through web, mobile and TV apps — with no account on any third-party cloud required.

<div align="center">
	<h2>Configuration</h2>
</div>

```yaml
  jellyfin:
    image: jellyfin/jellyfin
    container_name: homelab-jellyfin
    restart: unless-stopped
    user: 0:0
    ports:
      - ${JELLYFIN_WEB_PORT}:8096/tcp
      - ${JELLYFIN_CLIENT_PORT}:7359/udp
    volumes:
      - ${VOLUMES_LOCATION}/jellyfin/config:/config
      - ${VOLUMES_LOCATION}/jellyfin/cache:/config
      - type: bind
        source: ${MEDIA_DIRECTORY_LOCATION}
        target: /media
    environment:
      - JELLYFIN_PublishedServerUrl=http://jellyfin.${DOMAIN_NAME}
    extra_hosts:
      - 'host.docker.internal:host-gateway'
    networks:
      - nginx_network
      - network_access
```

`image: jellyfin/jellyfin` : The official image from Docker Hub<br>
`ports:` : 8096 for the web UI (routed by NGINX at `https://jellyfin.homelab.lan`) and 7359/udp for client auto-discovery on the LAN<br>
`volumes:` : Config and cache live under `${VOLUMES_LOCATION}/jellyfin`, while the media directory is bind-mounted read-location at `/media` inside the container — Jellyfin only reads it<br>
`environment: JELLYFIN_PublishedServerUrl` : The public URL advertised to clients, matching the reverse-proxied subdomain<br>
`networks:` : `nginx_network` for the reverse proxy, `network_access` to reach other services<br>
`restart: unless-stopped` : The container restarts automatically after a crash or a reboot<br>

<div align="center">
	<h2>Usage</h2>
</div>

Browse to `https://jellyfin.homelab.lan`, complete the setup wizard (language, admin account, add `/media` as a library), and let it scrape the metadata. Clients then authenticate against the same server.

<h2>Notes</h2>

- On a Raspberry Pi without hardware transcoding, transcoding a heavy stream is unrealistic — direct play is what keeps it smooth, so media files are kept in client-friendly formats.
- The `user: 0:0` (root) setting is deliberate so the container can read any file in the mounted media directory regardless of host permissions.
