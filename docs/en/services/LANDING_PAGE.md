<div align="center">
	<h1>Landing page</h1>
</div>

The landing page is a small custom web portal served at `https://homelab.lan`. It lists a link to every subdomain available on my network, so I don't have to remember each URL — the homelab's front door.

It is a React + Tailwind single-page app built with [Bun](https://bun.sh), from a `bun-react-tailwind` template. The build produces static files that NGINX serves directly.

<div align="center">
	<h2>Configuration</h2>
</div>

```yaml
  webserver:
    container_name: homelab-webserver
    build:
      context: ./
    restart: unless-stopped
    networks:
      - nginx_network
      - network_access
```

`build: context: ./` : The image is built from the local [Dockerfile](../../../config/landing_page/Dockerfile), which compiles the React app and ships the static output<br>
`networks:` : The container sits on `nginx_network` so the NGINX reverse proxy can serve it as `https://homelab.lan`, and on `network_access` so it can reach the other services (it includes an API tester that probes service endpoints)<br>
`restart: unless-stopped` : The container restarts automatically after a crash or a reboot<br>

The NGINX server block ([`landing_page.conf`](../../../config/network/nginx/files/site-availables/landing_page.conf)) proxies `https://homelab.lan` to the `webserver` container, with the address injected through the `LANDING_IP` / `LANDING_PORT` variables of the [`.env` file](../../../config/.env.template).

<div align="center">
	<h2>Development</h2>
</div>

The sources live in [`config/landing_page/files/`](../../../config/landing_page/files/). To work on it:

```bash
cd config/landing_page/files
bun install   # install dependencies
bun dev       # start the dev server with hot reloading
bun start     # production build
```

<h2>Notes</h2>

- Since the page is baked into the image at build time, adding a new service link means editing the source, then `make re` to rebuild.
- The `APITester.tsx` component lets me check from the page itself whether a service answers — handy as a poor man's status page next to [Uptime Kuma](./KUMA.md).
