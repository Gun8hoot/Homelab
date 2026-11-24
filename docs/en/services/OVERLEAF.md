<div align="center">
	<h1>Overleaf</h1>
</div>

Overleaf (Community Edition) is a self-hosted collaborative LaTeX editor: several people can edit the same document online at the same time, with live preview and compiled PDFs. I run it to write and share documents without depending on the public overleaf.com service.

<div align="center">
	<h2>Configuration</h2>
</div>

The full compose file lives at [`config/documents/overleaf/docker-compose.yaml`](../../../config/documents/overleaf/docker-compose.yaml). It defines three containers:

```yaml
  sharelatex:
    image: sharelatex/sharelatex
    container_name: homelab-sharelatex
    depends_on:
      mongo:
        condition: service_healthy
      redis:
        condition: service_started
    volumes:
      - ${VOLUMES_LOCATION}/sharelatex_data:/var/lib/overleaf
    environment:
      OVERLEAF_MONGO_URL: mongodb://mongo/sharelatex
      OVERLEAF_REDIS_HOST: redis
      REDIS_HOST: redis
      SANDBOXED_COMPILES: "true"
    networks:
      - nginx_network
      - overleaf-isolated

  mongo:
    image: mongo:8.0
    command: "--replSet overleaf"
    volumes:
      - ${VOLUMES_LOCATION}/mongo_data:/data/db
    healthcheck:
      test: echo 'db.stats().ok' | mongosh localhost:27017/test --quiet
      interval: 10s
      timeout: 10s
      retries: 5
    networks:
      - overleaf-isolated

  redis:
    image: redis:6.2
    volumes:
      - ${VOLUMES_LOCATION}/redis_data:/data
    networks:
      - overleaf-isolated
```

`sharelatex` : The web application. Its data (projects, compiled PDFs, user accounts) lives under `${VOLUMES_LOCATION}/sharelatex_data`<br>
`mongo` : Stores all project data. It runs with a replica set (`--replSet overleaf`), which Overleaf requires, and exposes a healthcheck so `sharelatex` waits for a database that is truly ready (`condition: service_healthy`)<br>
`redis` : Handles the real-time collaboration state and caches<br>
`networks:` : Same isolation pattern as Forgejo — the app sits on `nginx_network` for the reverse proxy and on `overleaf-isolated` with its databases. Nothing else can reach `mongo` or `redis`<br>
`SANDBOXED_COMPILES` : LaTeX compiles run in a sandboxed environment, so a malicious document can't escape into the container filesystem<br>

<div align="center">
	<h2>Usage</h2>
</div>

Once up, Overleaf is reachable through NGINX at `https://overleaf.homelab.lan`. The first visit shows the classic "complete the installation" page to create the admin account. After that, users register, create projects, and compile as on the public instance.

<h2>Notes</h2>

- This stack is the heaviest on the Pi (three containers, a full LaTeX distribution inside the image). It's the first candidate to move to a beefier machine when I upgrade hardware.
- The compose file also contains commented-out LDAP and nginx-proxy sections — useful references if I ever want centralized authentication.
- Backup-wise, `${VOLUMES_LOCATION}/mongo_data` is the critical volume: projects live in MongoDB, not on the filesystem.
