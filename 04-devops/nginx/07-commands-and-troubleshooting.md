# Commands & Troubleshooting

The commands you'll actually run day to day, and how to debug a broken Nginx setup.

## Core commands

```bash
sudo nginx -t                       # test configuration syntax — ALWAYS run before reload
sudo systemctl reload nginx          # apply config changes without dropping connections
sudo systemctl restart nginx          # full restart (briefly drops connections)
sudo systemctl status nginx            # is it running, and any recent errors
sudo systemctl enable nginx              # start automatically on boot
```

**Prefer `reload` over `restart`** for routine config changes — `reload` re-reads the config and gracefully finishes in-flight requests on the old worker processes before switching to new ones, rather than dropping active connections outright.

---

## Logs — where to actually look

```bash
sudo tail -f /var/log/nginx/access.log     # every request Nginx handles
sudo tail -f /var/log/nginx/error.log        # config errors, upstream failures, etc.
```

Per-site logs, if configured:

```nginx
server {
    access_log /var/log/nginx/myapp.access.log;
    error_log  /var/log/nginx/myapp.error.log;
}
```

Splitting logs per site makes it much easier to isolate one app's traffic/errors on a server hosting multiple sites.

---

## Common problems and how to diagnose them

### "502 Bad Gateway"

Means Nginx successfully received the request but couldn't get a valid response from the upstream (your Node app).

```bash
# is Node actually running and listening on the port Nginx expects?
curl http://localhost:3000
sudo tail -f /var/log/nginx/error.log
```

Usual causes: Node isn't running, is listening on a different port than `proxy_pass` expects, or crashed and hasn't restarted (see `16-production/02-graceful-shutdown-and-health-checks.md` and a process manager like PM2, `16-production/`, for auto-restart).

### "504 Gateway Timeout"

Nginx reached Node, but Node took too long to respond.

```nginx
location / {
    proxy_pass http://localhost:3000;
    proxy_read_timeout 60s;    # increase if your app genuinely needs longer
}
```

Before just raising the timeout, consider whether the slow response indicates a real problem (a slow database query, a blocking synchronous operation on the event loop — see `03-javascript-for-node/02-event-loop.md`) worth fixing at the source.

### Static files returning 404

Almost always an `alias` vs `root` mix-up — see `03-static-files-and-compression.md` for the distinction. Double-check the exact resulting filesystem path Nginx is trying to serve.

### Config changes not taking effect

```bash
sudo nginx -t          # confirm the file you edited has no syntax errors
sudo nginx -T           # dump the FULL effective config, including all included files —
                          # useful when you're not sure which file is actually being read
sudo systemctl reload nginx
```

A common trap: editing `sites-available/myapp` but forgetting it needs a symlink in `sites-enabled/` to actually be loaded (see `01-reverse-proxy-basics.md`), or having a duplicate/conflicting `server_name` in another enabled site.

### WebSocket connections failing/dropping

Confirm the `Upgrade`/`Connection` headers are present (`01-reverse-proxy-basics.md`), and check for a `proxy_read_timeout` that's too short for a long-lived WebSocket connection — the default (60s) can silently drop idle-but-still-open WebSocket connections.

```nginx
location /socket.io/ {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_read_timeout 3600s;    # generous timeout for long-lived connections
}
```

### Checking what Nginx thinks a request will match

```bash
sudo nginx -T | grep -A 5 "location /api"
```

Useful when multiple `location` blocks might overlap and you're unsure which one a given request actually matches.

---

## A useful debugging habit: check the response headers

```bash
curl -I https://example.com/api/products
```

```
HTTP/2 200
x-cache-status: HIT
x-powered-by: Express
```

Custom headers like `X-Cache-Status` (`04-caching.md`) or checking whether `X-Powered-By: Express` even appears (confirming the request actually reached Node) are quick ways to narrow down which layer — Nginx or Node — a problem lives in.

## Quick summary

- Always `nginx -t` before `reload`; prefer `reload` over `restart` to avoid dropping connections
- `502` means Node isn't responding at all; `504` means it responded too slowly — check logs and confirm Node is actually up on the expected port
- Static file 404s are almost always an `alias`/`root` confusion
- `nginx -T` dumps the full effective config — useful when multiple included files make it unclear what's actually active
- `curl -I` and custom response headers are a fast way to tell whether a problem is in Nginx or in Node itself

## Folder complete

That covers Nginx as a reverse proxy for Node: the basics, TLS, static files and compression, caching, load balancing, rate limiting, and troubleshooting. This ties into `16-production/03-docker-and-compose.md` and `04-nginx.md` for how this fits into a full production deployment.
