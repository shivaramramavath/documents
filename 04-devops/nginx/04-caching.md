# Caching at the Nginx Layer

Beyond serving static files and compressing responses, Nginx can cache entire responses from your Node app — so a repeated request never even reaches Node.

## `proxy_cache` — caching upstream responses

```nginx
http {
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=1g inactive=60m;

    server {
        location /api/ {
            proxy_pass http://localhost:3000;
            proxy_cache my_cache;
            proxy_cache_valid 200 10m;      # cache successful responses for 10 minutes
            proxy_cache_valid 404 1m;         # cache "not found" briefly too
            add_header X-Cache-Status $upstream_cache_status;  # useful for debugging
        }
    }
}
```

- `proxy_cache_path` — where cached responses live on disk, how much space they can use (`max_size`), and how long an unused entry stays before eviction (`inactive`)
- `proxy_cache_valid` — how long to cache responses of a given status code
- `X-Cache-Status` — adds a response header (`HIT`, `MISS`, `EXPIRED`, `BYPASS`) so you can see whether a given request was served from cache — invaluable for debugging caching behavior

```bash
curl -I https://example.com/api/products
```

```
X-Cache-Status: HIT
```

---

## What's safe to cache this way?

**Good candidates:** public, non-personalized `GET` endpoints — a product catalog, public blog posts, anything that returns the same response for every user.

**Bad candidates:** anything user-specific (a dashboard, an authenticated profile page) or anything that mutates state (`POST`/`PUT`/`DELETE`). Caching these at the Nginx layer risks **serving one user's cached response to a different user** — a serious bug, not just a performance quirk.

### Excluding requests with cookies/auth headers from caching

```nginx
location /api/ {
    proxy_pass http://localhost:3000;
    proxy_cache my_cache;
    proxy_cache_valid 200 5m;

    proxy_cache_bypass $http_authorization $cookie_session;
    proxy_no_cache $http_authorization $cookie_session;
}
```

`proxy_no_cache`/`proxy_cache_bypass` skip the cache entirely when an `Authorization` header or session cookie is present — a critical safeguard against accidentally caching (and then serving to someone else) an authenticated response.

---

## Cache key: what counts as "the same request"

By default, Nginx's cache key includes the scheme, method, host, and URI. Two requests with different query strings are cached separately by default — which is usually right, but can lead to excessive cache misses if a query param genuinely doesn't affect the response (e.g. a tracking param).

```nginx
proxy_cache_key "$scheme$request_method$host$uri";  # ignore query string entirely
```

Be deliberate here — stripping query params from the cache key means two URLs that _do_ return different content (e.g. `?page=1` vs `?page=2`) would incorrectly share a cached entry.

---

## Purging the cache

Nginx's open-source version has no built-in cache purge command — the common workarounds:

```bash
# nuke the whole cache directory (simple, but drops everything)
sudo rm -rf /var/cache/nginx/*
sudo systemctl reload nginx
```

For finer-grained purging, either use Nginx Plus (the paid version, which supports selective purging), or design cache keys/TTLs such that stale content expires quickly enough that manual purging is rarely needed.

---

## Browser caching vs Nginx `proxy_cache`: two different layers

|                                                                                       | Where it lives                   | Applies to                                         |
| ------------------------------------------------------------------------------------- | -------------------------------- | -------------------------------------------------- |
| Browser cache (`Cache-Control`, `expires` — see `03-static-files-and-compression.md`) | The client's own browser         | Only that one client, for assets it fetched itself |
| `proxy_cache`                                                                         | Nginx, shared across all clients | Every client hitting the same cached endpoint      |

Both are commonly used together: static assets get long browser cache lifetimes, while dynamic-but-cacheable API responses get a shorter `proxy_cache` lifetime shared across everyone.

---

## Nginx cache vs application-level caching (Redis)

`proxy_cache` caches entire **HTTP responses**. It's not a replacement for application-level caching with Redis (`07-databases/redis/02-caching-and-sessions.md`), which caches arbitrary data (a database query result, a computed value) that your app logic uses internally, often for authenticated/personalized data that Nginx-level caching wouldn't be safe for at all. The two solve overlapping but distinct problems, and larger systems often use both.

## Quick summary

- `proxy_cache` caches whole responses at Nginx, so repeat requests never reach Node at all
- Only cache public, non-personalized responses — always exclude requests carrying auth headers/session cookies via `proxy_no_cache`/`proxy_cache_bypass`
- `X-Cache-Status` is the fastest way to confirm whether caching is actually working
- Browser caching (client-side) and `proxy_cache` (Nginx-side, shared) are different, complementary layers
- `proxy_cache` isn't a substitute for Redis-based application caching — they solve different problems

## Next

`05-load-balancing.md` covers distributing requests across multiple Node instances.
