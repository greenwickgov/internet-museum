#!/bin/sh
set -eu

export SEARXNG_PORT=8080
export SEARXNG_BIND_ADDRESS=127.0.0.1

/usr/local/searxng/entrypoint.sh &
searx_pid=$!

cleanup() {
  kill -TERM "$searx_pid" 2>/dev/null || true
  wait "$searx_pid" 2>/dev/null || true
  exit 0
}
trap cleanup INT TERM

caddy run --config /etc/caddy/Caddyfile --adapter caddyfile &
caddy_pid=$!
wait "$caddy_pid"
cleanup
