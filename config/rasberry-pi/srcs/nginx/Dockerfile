
# --- Pull the base caddy image ---
FROM nginx:1.31.8-alpine

COPY ./files/. /etc/nginx/

# --- Activate subdomain ---
RUN mkdir -p /etc/nginx/sites-enabled
RUN ln -sf /etc/nginx/site-availables/homelab.lan.conf /etc/nginx/sites-enabled/homelab.lan
RUN ln -sf /etc/nginx/site-availables/pihole.homelab.lan.conf /etc/nginx/sites-enabled/pihole.homelab.lan
RUN ln -sf /etc/nginx/site-availables/kuma.homelab.lan.conf /etc/nginx/sites-enabled/kuma.homelab.lan
# RUN ln -sf /etc/nginx/site-availables/git.homelab.lan.conf /etc/nginx/sites-enabled/git.homelab.lan
RUN ln -sf /etc/nginx/site-availables/vault.homelab.lan.conf /etc/nginx/sites-enabled/vault.homelab.lan
# RUN ln -sf /etc/nginx/site-availables/files.homelab.lan.conf /etc/nginx/sites-enabled/files.homelab.lan

RUN chown -R nginx:root /etc/nginx
RUN chown -R nginx:root /var/cache/nginx

# --- Use the user nginx ---
# USER nginx

# --- Mark port as exposed ---
EXPOSE 80
EXPOSE 443
