
# --- Pull the base caddy image ---
FROM nginx:1.31.8-alpine

RUN apk add --no-cache bash
RUN mkdir -p /cert
COPY ./files/. /etc/nginx/

# --- Activate every subdomain ---
RUN mkdir -p /etc/nginx/sites-enabled
### LANDING PAGE ###
RUN ln -sf /etc/nginx/site-availables/homelab.lan.conf /etc/nginx/sites-enabled/homelab.lan
### PIHOLE ###
# RUN ln -sf /etc/nginx/site-availables/pihole.homelab.lan.conf /etc/nginx/sites-enabled/pihole.homelab.lan
### KUMA UPTIME ###
RUN ln -sf /etc/nginx/site-availables/kuma.homelab.lan.conf /etc/nginx/sites-enabled/kuma.homelab.lan
### FORGEJO ###
RUN ln -sf /etc/nginx/site-availables/git.homelab.lan.conf /etc/nginx/sites-enabled/git.homelab.lan
### VAULTWARDEN ###
# RUN ln -sf /etc/nginx/site-availables/vault.homelab.lan.conf /etc/nginx/sites-enabled/vault.homelab.lan
### JELLYFIN ###
RUN ln -sf /etc/nginx/site-availables/jelly.homelab.lan.conf /etc/nginx/sites-enabled/jelly.homelab.lan
### PROWLARR ###
RUN ln -sf /etc/nginx/site-availables/prowlarr.homelab.lan.conf /etc/nginx/sites-enabled/prowlarr.homelab.lan
### RADARR ###
RUN ln -sf /etc/nginx/site-availables/radarr.homelab.lan.conf /etc/nginx/sites-enabled/radarr.homelab.lan
### RADARR ###
RUN ln -sf /etc/nginx/site-availables/sonarr.homelab.lan.conf /etc/nginx/sites-enabled/sonarr.homelab.lan
### JELLYFIN ###
RUN ln -sf /etc/nginx/site-availables/jelly.homelab.lan.conf /etc/nginx/sites-enabled/jelly.homelab.lan
### QBITORRENT ###
RUN ln -sf /etc/nginx/site-availables/qbit.homelab.lan.conf /etc/nginx/sites-enabled/qbit.homelab.lan
### SEERR ###
RUN ln -sf /etc/nginx/site-availables/seerr.homelab.lan.conf /etc/nginx/sites-enabled/seerr.homelab.lan

# --- Adjust nginx user permission ---
RUN chown -R nginx:root /etc/nginx
RUN chown -R nginx:root /var/cache/nginx
# RUN chown -R nginx:root /cert
# RUN chmod -R 744 /cert

# --- Use the user nginx ---
# USER nginx

# --- Mark port as exposed ---
EXPOSE 80
EXPOSE 443
