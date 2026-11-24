<div align="center">
	<h1>NGINX</h1>
</div>

NGINX is a reverse proxy that forwards our requests to other services. It allows us to centralize everything behind the same IP, avoiding the need to expose any other address to the network. Each service gets its own subdomain (e.g. `https://kuma.homelab.lan`), and only the NGINX container publishes ports on the host.

<div align="center">
	<h2>Configuration</h2>
</div>

The container is built from a custom Dockerfile based on `nginx:1.31.8-alpine` ([Dockerfile](../../../config/network/nginx/Dockerfile)). Instead of using the default config, the image copies [`files/nginx.conf.template`](../../../config/network/nginx/files/nginx.conf.template) and one server block per service from [`files/site-availables/`](../../../config/network/nginx/files/site-availables/), using the classic `sites-available`/`sites-enabled` pattern of a Debian NGINX install — except the "enabled" files are rendered copies rather than symlinks.

Since the infrastructure can be split across multiple devices, NGINX must not enable a site for a service it may never see. Instead of a hardcoded list baked at build time, the enabled sites are decided at **container startup**: the master compose file is mounted read-only into the container (`/etc/nginx/stack.yaml`), and an [entrypoint script](../../../config/network/nginx/files/entrypoint.sh) enables exactly one site per uncommented `include:` line. The single source of truth for "which services run" is the include list of [`config/docker-compose.yaml`](../../../config/docker-compose.yaml) — the NGINX config always follows it automatically.

Services living outside the compose stack (e.g. Proxmox, which runs on the laptop) can still get a site through the `NGINX_EXTRA_SITES` variable of the `.env` file, which the entrypoint appends to the scanned list.

<div align="center">
	<h2>Injecting variables with envsubst</h2>
</div>

NGINX doesn't read environment variables, so the `.env` values can't be used directly in its config. The trick is `envsubst` (from the `gettext` package): it reads a template, replaces every `${VARIABLE}` with its value, and writes the final config. The substitution happens when the container **starts**, in the entrypoint script — so changing an IP or a port only requires editing the `.env` file and restarting the container, without rebuilding the image.

Two kinds of files get rendered:

- `/etc/nginx/nginx.conf.template` into `/etc/nginx/nginx.conf` (the global config)
- every enabled `site-availables/<service>.conf` into `sites-enabled/<service>` (the server blocks, so their `proxy_pass http://${..._IP}:${..._PORT}` placeholders are filled in)

Every `${..._IP}` **and** `${..._PORT}` variable from the `.env` file is passed down the chain: `.env` < compose `environment:` < `envsubst` variable list. For example a server block simply contains:

```nginx
proxy_pass http://${KUMA_IP}:${KUMA_PORT}/;
```

```sh
# files/entrypoint.sh
VARS='${LANDING_IP} ${LANDING_PORT} ... ${KUMA_IP} ${KUMA_PORT} ...'
envsubst "$VARS" < "$conf" > "$SITES_ENABLED/$service"
```

The compose file passes the `.env` values to the container at runtime:

```yaml
  nginx:
    container_name: homelab-nginx
    build:
      context: ./
    environment:
      LANDING_IP: ${LANDING_IP}
      KUMA_IP: ${KUMA_IP}
      PIHOLE_IP: ${PIHOLE_IP:-pihole}
      # ...one *_IP variable per backend service
      LANDING_PORT: ${LANDING_PORT}
      KUMA_PORT: ${KUMA_PORT}
      PIHOLE_WEB_PORT: ${PIHOLE_WEB_PORT}
      # ...one *_PORT variable per backend service
      # Extra sites for services living outside the compose stack
      NGINX_EXTRA_SITES: ${NGINX_EXTRA_SITES:-}
    ports:
      # SSH
      - "22:22/tcp"
      # DNS
      # - "53:53"
      # HTTP/HTTPS
      - "80:80/tcp"
      - "443:443/tcp"
    restart: unless-stopped
    networks:
      - network_access
      - nginx_network
    volumes:
      # Master compose file, scanned at startup to know which
      # services are enabled (see files/entrypoint.sh)
      - type: bind
        source: ../../docker-compose.yaml
        target: /etc/nginx/stack.yaml
        read_only: true
        bind:
          create_host_path: false
      - type: bind
        source: ${SSL_CERTIFICATE_LOCATION}
        target: /cert/fullchain.pem
        read_only: true
        bind:
          create_host_path: false
      - type: bind
        source: ${SSL_KEY_LOCATION}
        target: /cert/privkey.pem
        read_only: true
        bind:
          create_host_path: false
```

`environment:` : Every `*_IP` and `*_PORT` variable per backend service, read from the `.env` file and injected into the config at startup. Services without a dedicated `.env` entry get a container-name default (e.g. `VAULTWARDEN_IP: ${VAULTWARDEN_IP:-vaultwarden}`)<br>
`ports:` : NGINX is the only service exposed to the network. It currently publishes:
- 80/443: HTTP and HTTPS entry points for every subdomain
- 22 (TCP): SSH — published for the `stream` forwarding, but the `stream` block is currently disabled (see [TCP/UDP stream forwarding](#tcpudp-stream-forwarding)), so nothing answers on it for now
- 53 (TCP + UDP): DNS — commented out in the compose file to match its disabled `stream` server<br>
`networks:` : NGINX sits on both `network_access` and `nginx_network`, so it can reach every backend container without them publishing any port themselves<br>
`volumes:` : The TLS certificate and private key are bind-mounted read-only from the paths defined by `SSL_CERTIFICATE_LOCATION` and `SSL_KEY_LOCATION` in the `.env` file (see `make cert` in the [Makefile](../../../Makefile) to generate a self-signed pair), plus the master compose file used to know which sites to enable<br>

The important detail of the `envsubst` call is the variable list between the quotes: **only** the listed `${VARIABLE}`s are substituted. Without it, `envsubst` would also blank out NGINX's own runtime variables (`$host`, `$remote_addr`, `$scheme`...) and break every server block.

In the template, the injected values feed `map` directives that expose each backend as an NGINX variable:

```nginx
map "" $kuma { default "${KUMA_IP}"; }
```

so a server block uses `proxy_pass http://$kuma:3001$request_uri;`. Because the hostname sits in a variable, NGINX resolves it **per request, at runtime** — never at startup. This is what makes split/multi-device deployments safe: NGINX starts fine even when an enabled service is down, has not started yet, or runs on another machine.

Watch out for one subtlety if you decided to modify one of the configuration available or you add a new one for a new service: when `proxy_pass` contains variables **and** a URI, that URI replaces the original request path entirely (`proxy_pass http://$kuma:3001/;` would send every request to `/`). That's why every variable-based upstream ends with `$request_uri`, which forwards the original path and query string unchanged.

<div align="center">
	<h2>TLS termination</h2>
</div>

All HTTP traffic is redirected to HTTPS:

```nginx
server {
    listen 80;
    server_name _;
    return 301 https://$host$request_uri;
}
```

The TLS settings (defined in `nginx.conf.template`) enable TLS 1.2/1.3 only, prefer strong ECDHE ciphers, and use the certificate mounted at `/cert/`. Since all my subdomains live under `*.homelab.lan`, a single self-signed wildcard-style cert covers everything (browsers show a warning, which I just accept for LAN use).

One last detail of the HTTPS side: the landing page's server block declares `listen 443 ssl default_server;`, so a request for a subdomain that doesn't exist (or a direct hit on the host's IP) falls back to the landing page instead of an error page — the homelab's front door catches every knock.

<div align="center">
	<h2>Adding a new subdomain</h2>
</div>

1. Create a new server block in `config/network/nginx/files/site-availables/<service>.conf` — the file name **must** match the service directory name in the master compose file's include path (e.g. `./storage/engram/...` → `engram.conf`). Every existing site follows this shape (see [`kuma.conf`](../../../config/network/nginx/files/site-availables/kuma.conf)):

	```nginx
	server {
	    listen 443 ssl;
	    server_name <service>.homelab.lan;

	    location / {
	        proxy_pass         http://$<service>:${<SERVICE>_PORT}$request_uri;
	        proxy_http_version 1.1;

	        proxy_set_header   Host              $host;
	        proxy_set_header   X-Real-IP         $remote_addr;
	        proxy_set_header   X-Forwarded-For   $remote_addr;
	        proxy_set_header   X-Forwarded-Proto $scheme;
	        proxy_set_header   Upgrade           $http_upgrade;

	        proxy_read_timeout 300s;   # keeps websocket connections idle longer than the 60s default
	    }
	}
	```

	Depending on the service, the block can gain extra lines — all patterns already in use in `site-availables/`:
	- `client_max_body_size 512m;` for services receiving large uploads ([`anki-sync.conf`](../../../config/network/nginx/files/site-availables/anki-sync.conf), [`engram.conf`](../../../config/network/nginx/files/site-availables/engram.conf))
	- `proxy_pass https://...` when the upstream itself speaks HTTPS ([`proxmox.conf`](../../../config/network/nginx/files/site-availables/proxmox.conf))
	- `allow 192.168.0.0/16; deny all;` to restrict a site to the LAN only ([`proxmox.conf`](../../../config/network/nginx/files/site-availables/proxmox.conf))

2. Add the matching variables everywhere the chain needs them:
	- `<SERVICE>_IP` / `<SERVICE>_PORT` in `config/.env.template` (and `config/.env`)
	- `<SERVICE>_IP: ${<SERVICE>_IP}` / `<SERVICE>_PORT: ${<SERVICE>_PORT}` in the compose `environment:` section
	- both in the `VARS` list of the [entrypoint script](../../../config/network/nginx/files/entrypoint.sh)
	- a `map "" $<service> { default "${<SERVICE>_IP}"; }` line in `nginx.conf.template` (the server block should use the `$<service>` variable, so NGINX never resolves it at startup)
3. Enable the service by uncommenting its `include:` line in [`config/docker-compose.yaml`](../../../config/docker-compose.yaml) — the site is enabled automatically at the next startup. (For a service outside the stack, add its name to `NGINX_EXTRA_SITES` in the `.env` file instead.)
4. Add a local DNS record in Pi-hole pointing `<service>.homelab.lan` to the NGINX host (see [Pi-hole](./PIHOLE.md)).
5. Restart with `make re`.

<div align="center">
	<h2>TCP/UDP stream forwarding</h2>
</div>

HTTP proxying works at the application level, but NGINX can also forward raw TCP/UDP streams — one layer below, with no notion of URLs or hostnames — through the `stream {}` block of `nginx.conf.template`:

```nginx
stream {
    # Docker's embedded DNS, needed to resolve $pihole_dns / $forgejo_ssh_*
    resolver 127.0.0.11 valid=10s;

    map "" $pihole_dns       { default "${PIHOLE_IP}"; }
    map "" $forgejo_ssh_ip   { default "${FORGEJO_IP}"; }
    map "" $forgejo_ssh_port { default "${FORGEJO_SSH_PORT}"; }

    server {
        listen 22;
        proxy_pass $forgejo_ssh_ip:$forgejo_ssh_port;
    }

    server {
        listen 53 udp;
        listen 53;
        proxy_pass $pihole_dns:53;
    }
}
```

The goal is to publish DNS and SSH through the same single exposed container, keeping every other host port closed: port 22 would be forwarded to the Forgejo container's SSH listener (so `git@git.homelab.lan:user/repo.git` works through the single entry point — see [Forgejo](./FORGEJO.md)), and port 53 (both TCP and UDP, since DNS uses both) to the Pi-hole container. As with the HTTP upstreams, both targets are resolved through variables (`map` plus the `stream`-level `resolver`), so NGINX still starts cleanly when Forgejo or Pi-hole is disabled. The block is still commented out for now — it's on the [TODO list](#todo) — which also means port 22 is published by the compose file but has no listener inside the container yet.

<h2>Notes</h2>

- Site files are named after the **service directory** of their include path, not the subdomain they serve (e.g. `forgejo.conf` serves `git.homelab.lan`, `qbittorent.conf` serves `qbit.homelab.lan`). The entrypoint matches on the directory name.
- The rendered config lives inside the container — inspect it any time with `docker run --rm --entrypoint cat homelab-nginx /etc/nginx/nginx.conf` (or `ls /etc/nginx/sites-enabled/`).

<h2>TODO</h2>
- `SMB_PORT` from the `.env` file isn't wired into NGINX: Samba is reached directly on the LAN, never through the reverse proxy.
- Activate SSH and DNS forwarding for both Forgejo and PiHole
