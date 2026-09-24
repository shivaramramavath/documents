# Rate Limiting at the Nginx Layer

Stopping abusive or excessive traffic before it ever reaches your Node app — a first line of defense that complements, rather than replaces, application-level rate limiting (`08-authentication-security/06-rate-limiting.md`).

## Basic request rate limiting

```nginx
http {
    limit_req_zone $binary_remote_addr zone=mylimit:10m rate=10r/s;

    server {
        location /api/ {
            limit_req zone=mylimit burst=20 nodelay;
            proxy_pass http://localhost:3000;
        }
    }
}
```

- `limit_req_zone` — defines a shared memory zone (`10m` ≈ enough for ~160,000 tracked IPs) keyed by `$binary_remote_addr` (the client's IP), allowing `10` requests per second per IP
- `limit_req zone=mylimit` — applies that limit to this location
- `burst=20` — allows short bursts above the steady rate, queuing up to 20 excess requests instead of rejecting them outright
- `nodelay` — serves burst requests immediately instead of artificially delaying them to smooth out the rate (without it, burst requests are still allowed but spaced out, which can add latency)

### What happens when the limit is exceeded

```
503 Service Temporarily Unavailable
```

By default, Nginx returns `503` for requests beyond the limit (and burst). You can customize this:

```nginx
limit_req_status 429;   # respond with 429 Too Many Requests instead — the more semantically correct status
```

`429` (see `05-http-web/01-http-methods-and-status-codes.md`) is the status code actually intended for this situation — worth setting explicitly, since Nginx's default of `503` can be confused with a genuine server outage.

---

## Limiting concurrent connections

```nginx
http {
    limit_conn_zone $binary_remote_addr zone=addr:10m;

    server {
        location /download/ {
            limit_conn addr 5;    # max 5 simultaneous connections per IP
            proxy_pass http://localhost:3000;
        }
    }
}
```

Different from request _rate_ — this limits how many connections a single client can have **open at once**, useful for things like file downloads where one client shouldn't be able to open dozens of parallel connections.

---

## Different limits for different routes

```nginx
http {
    limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;

    server {
        location /api/login {
            limit_req zone=login burst=3 nodelay;
            proxy_pass http://localhost:3000;
        }

        location /api/ {
            limit_req zone=general burst=20 nodelay;
            proxy_pass http://localhost:3000;
        }
    }
}
```

A login endpoint is a common target for credential-stuffing/brute-force attempts and typically warrants a much stricter limit than general API traffic.

---

## Why not rely on Nginx rate limiting alone?

Nginx's rate limiting is keyed on IP address by default, which has real limitations:

- Many legitimate users can share one IP (corporate NAT, mobile carrier-grade NAT), so a strict IP-based limit can collectively throttle a whole office or cellular network
- It can't distinguish between users behind the same IP, or apply different limits per authenticated user/API key
- It resets if Nginx reloads/restarts, and doesn't share state across multiple Nginx instances without extra configuration

Application-level rate limiting (`08-authentication-security/06-rate-limiting.md`), often backed by Redis, can key on user ID or API key instead of just IP, and share state consistently across multiple app instances. **The two layers complement each other**: Nginx catches high-volume abuse cheaply before it burns any Node/database resources at all; the application layer applies more precise, business-aware limits on top.

## Quick summary

- `limit_req` throttles request _rate_ per key (usually IP); `limit_conn` limits concurrent _connections_ per key
- `burst`/`nodelay` control how bursty traffic is handled rather than rejected outright
- Set `limit_req_status 429` — Nginx's default `503` is semantically wrong for this situation
- Apply stricter limits to sensitive endpoints (login, password reset) than general API traffic
- Nginx-level limiting is a cheap first line of defense, not a replacement for user/API-key-aware application-level limiting

## Next

`07-commands-and-troubleshooting.md` covers the commands you'll actually run day to day, and how to debug a broken config.
