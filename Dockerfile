FROM caddy:2-alpine AS cors_proxy

FROM searxng/searxng:latest

USER root
COPY --from=cors_proxy /usr/bin/caddy /usr/local/bin/caddy

COPY searxng/settings.yml /etc/searxng/settings.yml
COPY searxng/Caddyfile /etc/caddy/Caddyfile
COPY searxng/start.sh /usr/local/bin/start-museum-search
RUN chmod +x /usr/local/bin/start-museum-search

EXPOSE 10000
ENTRYPOINT ["/usr/local/bin/start-museum-search"]
