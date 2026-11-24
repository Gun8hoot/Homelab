<div align="center">
	<h1>Anki Sync Server</h1>
</div>

Anki Sync Server is a self-hosted implementation of the AnkiWeb sync API. It lets me sync my flashcard collections between my desktop and mobile Anki clients without going through AnkiWeb, so my decks never leave my network.

<div align="center">
	<h2>Configuration</h2>
</div>

```yaml
services:
  anki-sync:
    image: jeankhawand/anki-sync-server:26.08
    container_name: homelab-anki-sync
    restart: unless-stopped
    environment:
      SYNC_USER1: "${ANKI_USER}:${ANKI_PASS}"
    volumes:
      - ${VOLUMES_LOCATION}/anki-sync:/anki_data/
    networks:
      - nginx_network
```

`image: jeankhawand/anki-sync-server:26.08` : A Docker image wrapping the official sync server bundled with Anki, built from Anki's own Dockerfile and rebuilt on every Anki release. The image is pinned so a client update never breaks the sync protocol unexpectedly<br>
`environment: SYNC_USER1` : The sync credentials (`user:password`) picked up from `ANKI_USER` / `ANKI_PASS` in `config/.env`. More accounts can be added with `SYNC_USER2`, `SYNC_USER3`, ...<br>
`volumes:` : The server stores a copy of every collection and media file under `${VOLUMES_LOCATION}/anki-sync`, mounted at `/anki_data`. This folder must not be the same as a local Anki data folder — data reaches the server through sync, never by copying files<br>
`networks:` : The server sits on `nginx_network` only — it speaks plain HTTP, so TLS termination is handled by NGINX at `https://anki.homelab.lan` (see [NGINX](./NGINX.md))<br>
`restart: unless-stopped` : The container restarts automatically after a crash or a reboot<br>

<div align="center">
	<h2>Usage</h2>
</div>

1. Point your DNS at the Pi-hole host and add a local record so `anki.homelab.lan` resolves to the NGINX host.
2. In every Anki client (desktop or mobile), open **Preferences → Syncing** (desktop) / **Settings → Sync** (mobile).
3. Set the custom sync server URL to `https://anki.homelab.lan`.
4. Put `ANKI_USER` / `ANKI_PASS` in the AnkiWeb account fields of the preferences.
5. Hit Sync — on first sync, clients ask whether to upload local data or download from the server. Pick upload if the server is empty.

<h2>Notes</h2>

- Anki clients require HTTPS for a custom sync server: without the TLS termination done by NGINX, they refuse to connect.
- The NGINX site for `anki.homelab.lan` raises `client_max_body_size` to 512m, because syncing collections and media can push very large uploads that would otherwise hit NGINX's 1m default limit.
- The server's message strings still say "AnkiWeb" even when talking to this server (e.g. "Cannot connect to AnkiWeb"), which is normal.
- Keep the client and server Anki versions in the same ballpark: newer clients may use sync protocol changes the server does not understand yet.
- Backups of the `${VOLUMES_LOCATION}/anki-sync` folder are what protect your decks — treat them like any other critical data.
