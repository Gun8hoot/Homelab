#!/bin/sh
set -eu

STACK_FILE="/etc/nginx/stack.yaml"
SITES_AVAILABLE="/etc/nginx/site-availables"
SITES_ENABLED="/etc/nginx/sites-enabled"

# --- Variables allowed in templates ---
# Only these are substituted, so NGINX runtime variables
# like $host or $remote_addr are left untouched.
# Every default lives in the compose environment (environment: ... :- fallbacks).
VARS='${LANDING_IP} ${LANDING_PORT} ${JELLYFIN_IP} ${JELLYFIN_PORT} ${PROWLARR_IP} ${PROWLARR_PORT} ${QBITTORRENT_IP} ${QBITTORRENT_WEB_PORT} ${QBITTORRENT_TORRENTTING_PORT} ${RADARR_IP} ${RADARR_PORT} ${SEERR_IP} ${SEERR_PORT} ${SONARR_IP} ${SONARR_PORT} ${KUMA_IP} ${KUMA_PORT} ${PIHOLE_IP} ${PIHOLE_WEB_PORT} ${FORGEJO_IP} ${FORGEJO_WEB_PORT} ${FORGEJO_SSH_PORT} ${PROXMOX_IP} ${PROXMOX_PORT} ${VAULTWARDEN_IP} ${ANKI_IP} ${ENGRAM_IP}'

# --- Render the global config from the template ---
envsubst "$VARS" < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# --- Enable one site per service included in the master compose file ---
# The master compose file is mounted read-only at /etc/nginx/stack.yaml.
# Every uncommented "include:" line points to ./<category>/<service>/docker-compose.yaml,
# so the service directory name matches its site file in site-availables.
# NGINX_EXTRA_SITES adds sites for services living outside the compose stack (e.g. proxmox).
mkdir -p "$SITES_ENABLED"
rm -f "$SITES_ENABLED"/*

enabled=$(grep -E '^[[:space:]]*-[[:space:]]*\./' "$STACK_FILE" 2>/dev/null | sed -E 's/^[[:space:]]*-[[:space:]]*//' || true)

for service in $enabled ${NGINX_EXTRA_SITES:-}; do
    # Include paths look like ./<category>/<service>/docker-compose.yaml;
    # the service directory name is also the site file name.
    service=$(basename "$(dirname "$service")")
    conf="$SITES_AVAILABLE/$service.conf"
    if [ -f "$conf" ]; then
        envsubst "$VARS" < "$conf" > "$SITES_ENABLED/$service"
        echo "[nginx] enabled site: $service"
    fi
done

exec "$@"
