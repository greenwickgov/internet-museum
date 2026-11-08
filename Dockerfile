FROM searxng/searxng:latest

USER root
RUN apt-get update \
  && apt-get install -y --no-install-recommends caddy \
  && rm -rf /var/lib/apt/lists/*

COPY searxng/settings.yml /etc/searxng/settings.yml
COPY searxng/Caddyfile /etc/caddy/Caddyfile
COPY searxng/start.sh /usr/local/bin/start-museum-search
RUN chmod +x /usr/local/bin/start-museum-search

EXPOSE 10000
ENTRYPOINT ["/usr/local/bin/start-museum-search"]
