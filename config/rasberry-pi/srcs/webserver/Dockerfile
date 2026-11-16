
FROM oven/bun:1.4.4-alpine

RUN mkdir -p /srv/webserver
COPY ./files/. /srv/webserver/
WORKDIR /srv/webserver

CMD [ "bun", "run", "start"]
