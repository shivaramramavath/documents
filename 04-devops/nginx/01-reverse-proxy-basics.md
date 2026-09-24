# Reverse Proxy Basics

## Why put Nginx in front of Node at all?

Node can serve HTTP directly (`02-core-modules/03-http.md`), so a reverse proxy isn't strictly required — but Nginx handles several things far better than Node should have to:

- **TLS termination** — Nginx handles HTTPS certificates; Node only ever speaks plain HTTP internally (`02-tls-https.md`)
- **Serving static files** — far more efficient than Node reading files off disk per request (`03-static-files-and-compression.md`)
- **Load balancing** — distributing requests across multiple Node instances (`05-load-balancing.md`)
- **Buffering slow clients** — protects Node's event loop from a slow network connection holding up a worker
- **A single, well-audited layer** for security headers and rate limiting (`06-rate-limiting.md`)

---

## Basic reverse proxy config

```nginx
# /etc/nginx/sites-available/myapp
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### What each header actually does

| Header                            | Why it's needed                                                                                                  |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `Host $host`                      | Without it, Node sees `localhost` as the requested host, not the real domain                                     |
| `X-Real-IP` / `X-Forwarded-For`   | Node otherwise sees every request as coming from Nginx's own IP, not the real client                             |
| `X-Forwarded-Proto`               | Tells Node whether the original request was HTTPS — needed since Nginx talks to Node over plain HTTP regardless  |
| `Upgrade` / `Connection: upgrade` | Required for WebSocket connections (`12-realtime/01-websocket-and-socketio.md`) to pass through the proxy at all |

---

## Enabling a site

```bash
sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/
sudo nginx -t          # test config for syntax errors before reloading
sudo systemctl reload nginx
```

Always run `nginx -t` before reloading — it catches syntax errors before they take down your currently-running config.

---

## Trusting the proxy in Express

Node needs to know it's behind a proxy to interpret the `X-Forwarded-*` headers correctly:

```js
app.set("trust proxy", 1);
```

Without this:

- `req.ip` reflects Nginx's IP, not the real client's
- `req.secure` is always `false`, even when the original request was HTTPS
- Cookies set with `secure: true` (see `05-http-web/03-cookies.md`) can silently fail to be sent back by the browser, since Express doesn't realize the connection is effectively secure

This is one of the most common sources of confusion when an app behaves correctly locally but misbehaves once deployed behind Nginx.

## Quick summary

- `proxy_pass` forwards requests to Node; the `X-Forwarded-*`/`Host` headers preserve information Node would otherwise lose
- WebSockets need the `Upgrade`/`Connection` headers explicitly passed through
- `app.set("trust proxy", 1)` in Express is required to correctly interpret those headers on the Node side
- `nginx -t` before every `reload` catches config errors before they take effect

## Next

`02-tls-https.md` covers terminating HTTPS at Nginx.
