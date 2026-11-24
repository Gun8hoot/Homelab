# --- Pull the base nginx image ---
FROM nginx:1.31.8-alpine

# --- Needed for envsubst ---
RUN apk add --no-cache gettext

RUN mkdir -p /cert
COPY ./files/. /etc/nginx/
RUN chmod +x /etc/nginx/entrypoint.sh

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

# --- Render configs at startup ---
# The entrypoint renders nginx.conf and only the sites matching the
# services enabled in the master compose file (see files/entrypoint.sh).
# Declaring ENTRYPOINT resets the base image CMD, so it must be re-declared.
ENTRYPOINT ["/etc/nginx/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
