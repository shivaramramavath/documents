# Static Files & Compression

Two closely related performance wins: letting Nginx serve static assets directly instead of Node, and compressing responses before they go over the network.

## Serving static files directly (bypassing Node entirely)

```nginx
server {
    listen 80;
    server_name example.com;

    location /static/ {
        alias /var/www/myapp/public/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        # ... other proxy headers, see 01-reverse-proxy-basics.md
    }
}
```

Requests to `/static/*` are read straight off disk by Nginx and never reach Node at all. This is significantly faster than Node reading and streaming the file itself (`02-core-modules/05-streams.md`), and frees up Node's limited event-loop capacity for actual application logic.

### `alias` vs `root`

```nginx
location /static/ {
    root /var/www/myapp/public;    # requests to /static/x.png → /var/www/myapp/public/static/x.png
}

location /static/ {
    alias /var/www/myapp/public/;   # requests to /static/x.png → /var/www/myapp/public/x.png
}
```

`root` appends the full matched location to the path; `alias` replaces the matched location with the given path. A very common source of "404 on every static file" bugs is using `root` when you meant `alias`, or vice versa.

---

## Gzip compression

Compressing text-based responses (HTML, CSS, JS, JSON) before sending them can dramatically reduce transfer size — often 60-80% smaller for typical text content.

```nginx
http {
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    gzip_min_length 1024;      # don't bother compressing very small responses
    gzip_comp_level 6;          # 1 (fastest, less compression) to 9 (slowest, most compression)
}
```

- `gzip_types` — only compress these content types; compressing already-compressed formats (images, videos, zip files) wastes CPU for no benefit
- `gzip_min_length` — skip compression for tiny responses, where the overhead isn't worth it
- `gzip_comp_level` — a trade-off between CPU cost and compression ratio; 5-6 is a reasonable default

### Should this happen in Nginx or in Node?

Express has its own compression middleware:

```js
import compression from "compression";
app.use(compression());
```

**Prefer compressing at Nginx** when Nginx is already in front of the app — it's implemented in optimized C code and doesn't cost your Node process any CPU. Use Express's `compression` middleware only when there's no reverse proxy in front of Node at all (e.g. a very simple deployment without Nginx).

---

## Brotli: a modern alternative to gzip

Brotli generally compresses better than gzip for the same CPU cost, and is supported by all modern browsers.

```nginx
# requires the ngx_brotli module, not built into Nginx by default
brotli on;
brotli_types text/plain text/css application/json application/javascript;
brotli_comp_level 6;
```

Unlike gzip, Brotli support isn't compiled into stock Nginx — it requires either building Nginx with the `ngx_brotli` module or using a distribution that includes it. Many deployments run gzip and Brotli side by side; Nginx serves whichever the client's `Accept-Encoding` header indicates support for, defaulting to gzip if Brotli isn't available.

---

## Caching static assets in the browser

```nginx
location /static/ {
    alias /var/www/myapp/public/;
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

- `expires 30d` — tells the browser it can reuse this file for 30 days without re-requesting it
- `immutable` — tells the browser this exact file will never change, so it shouldn't even revalidate it — appropriate for assets with a content hash in the filename (e.g. `app.a1b2c3.js`), since a genuinely new version would have a different filename entirely

This is a different, complementary concern to Nginx's own response cache, covered in `04-caching.md`.

## Quick summary

- Serve static assets directly from Nginx with `location` + `alias`/`root` — never route them through Node
- `alias` replaces the matched path; `root` appends it — a common source of static-file 404s if confused
- Compress text-based responses with gzip (built in) or Brotli (needs a module, generally better ratio); prefer doing this at Nginx over Node's `compression` middleware when Nginx is already in the picture
- Long browser cache lifetimes (`expires`, `Cache-Control: immutable`) are safe for content-hashed filenames, since a new version gets a new filename automatically

## Next

`04-caching.md` covers Nginx's own response cache — caching whole responses from Node, not just static files.
