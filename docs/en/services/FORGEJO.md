<div align="center">
	<h1>Forgejo</h1>
</div>

Forgejo is a self-hosted, open-source alternative to GitHub (a soft fork of Gitea). It provides git hosting, a web UI for repositories, issues and pull requests — letting me keep my code (including this homelab repository) on my own hardware. It is reachable at `https://git.homelab.lan`.

<div align="center">
	<h2>Configuration</h2>
</div>

```yaml
  forgejo:
    container_name: homelab-forgejo
    image: codeberg.org/forgejo/forgejo:17
    environment:
      - USER_UID=1000
      - USER_GID=1000
      - FORGEJO__database__DB_TYPE=postgres
      - FORGEJO__database__HOST=forgejo_database:5432
      - FORGEJO__database__NAME=forgejo
      - FORGEJO__database__USER=${FORGEJO_DATABASE_USER}
      - FORGEJO__database__PASSWD=${FORGEJO_DATABASE_PASS}
      - HTTP_PORT=${FORGEJO_WEB_PORT}
    # ports:
    #   - "0.0.0.0:${FORGEJO_WEB_PORT}:${FORGEJO_WEB_PORT}"
    #   - "0.0.0.0:${FORGEJO_SSH_PORT}:${FORGEJO_SSH_PORT}"
    networks:
      - nginx_network
      - forgejo-isolated
    volumes:
      - ${VOLUMES_LOCATION}/forgejo_data:/var/lib/gitea
      - /etc/localtime:/etc/localtime:ro
      - ./app.ini:/etc/forgejo/app.ini
    depends_on:
      - forgejo_database
    restart: unless-stopped

  forgejo_database:
    container_name: homelab-forgejo-database
    image: postgres:14
    environment:
      - POSTGRES_USER=${FORGEJO_DATABASE_USER}
      - POSTGRES_PASSWORD=${FORGEJO_DATABASE_PASS}
      - POSTGRES_DB=forgejo
    networks:
      - forgejo-isolated
    volumes:
      - ${VOLUMES_LOCATION}/forgejo_database:/var/lib/postgresql/data
    restart: unless-stopped

networks:
  forgejo-isolated:
    external: false
```

`image: codeberg.org/forgejo/forgejo:17` : Forgejo is pulled from Codeberg's registry rather than Docker Hub, version pinned<br>
`FORGEJO__*` environment variables : They follow the `[section]__key` pattern and override the `app.ini` settings — here the database connection, so the two containers match<br>
`networks:` : Two networks, on purpose. `nginx_network` lets NGINX reach the web UI at `https://git.homelab.lan`, while `forgejo-isolated` is the only network the database sits on. This way the reverse proxy (or any other service) can't touch the database directly<br>
`volumes:` : Git repositories and attachments live under `${VOLUMES_LOCATION}/forgejo_data`, database data under `${VOLUMES_LOCATION}/forgejo_database`. The local `app.ini` (mounted from `config/storage/forgejo/`) provides the fine-grained config<br>
`depends_on: forgejo_database` : Forgejo starts after its database container (a healthcheck-based condition would be even stricter, but Forgejo retries its connection well enough at this scale)<br>

<div align="center">
	<h2>Using SSH</h2>
</div>

HTTPS cloning works out of the box, but SSH cloning (`git clone git@git.homelab.lan:user/repo.git`) needs port 22 to reach the Forgejo container. Since it's the NGINX container that publishes host port 22, the forwarding is done by [NGINX](./NGINX.md) — and the host's own SSH daemon must first be moved to another port, or Docker can't claim port 22 for it.

The [NGINX config template](../../../config/network/nginx/files/nginx.conf.template) already contains the matching `stream {}` block, currently commented out. It just needs uncommenting — and note that the SSH and DNS servers share the **same** `stream` block, since NGINX only allows one per config:

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

With that enabled, every connection to port 22 is routed to Forgejo's SSH listener, so `git@git.homelab.lan:user/repo.git` works exactly like on any public git host. The same block also proxies DNS to the Pi-hole container, keeping the single-entry-point rule intact.

The alternative is to skip NGINX and uncomment the `ports:` block of the Forgejo compose file, which publishes `${FORGEJO_WEB_PORT}` and `${FORGEJO_SSH_PORT}` directly on the host — but that breaks the single entry point, so the `stream` route is preferred.

<div align="center">
	<h2>Usage</h2>
</div>

Once the containers are up, browse to `https://git.homelab.lan` and complete the installation page: database values are already injected, so it's mostly about creating the admin account. Then git works as usual:

```bash
git clone https://git.homelab.lan/<user>/<repo>.git
```

SSH cloning becomes available as soon as the `stream` block (or the compose `ports:` block) is enabled — see [Using SSH](#using-ssh) above.

<h2>Notes</h2>

- The database uses a version older than the latest (postgres:14) on purpose: it matches what Forgejo 17 supports comfortably, and upgrading both in lockstep is safer than chasing `latest`.
- Backups mean saving both volumes: the data volume alone is useless without the database holding the metadata (users, issues, PRs).
- The `app.ini` bind-mounted by the compose file is **not committed to this repo** (it doesn't exist in `config/storage/forgejo/` at all right now). On a fresh clone, put one there before `make up` — otherwise Docker creates a *directory* in its place and Forgejo's configuration breaks.
