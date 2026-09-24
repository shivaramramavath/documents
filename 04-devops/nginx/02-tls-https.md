# TLS / HTTPS Termination

Terminating HTTPS at Nginx means Nginx handles the certificate and encryption, and forwards plain HTTP internally to Node — the standard setup for almost every deployment.

```
Client --HTTPS--> Nginx --HTTP--> Node (localhost:3000)
```

## Basic HTTPS server block

```nginx
server {
    listen 443 ssl;
    server_name example.com;

    ssl_certificate     /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

# redirect plain HTTP to HTTPS
server {
    listen 80;
    server_name example.com;
    return 301 https://$host$request_uri;
}
```

The second `server` block is what makes `http://example.com` automatically redirect to `https://example.com` — without it, both would work side by side, which is rarely what you want in production.

---

## Getting a free certificate with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d example.com -d www.example.com
```

Certbot:

1. Verifies you control the domain
2. Obtains a certificate from Let's Encrypt
3. **Automatically edits your Nginx config** to add the `ssl_certificate` lines and the HTTP→HTTPS redirect
4. Sets up a scheduled task to auto-renew before the certificate expires (Let's Encrypt certificates are valid for 90 days)

### Verifying auto-renewal is set up

```bash
sudo certbot renew --dry-run
```

Runs through the renewal process without actually renewing, to confirm it would succeed when it actually runs.

---

## Recommended TLS hardening

Certbot's defaults are reasonable, but a few settings are worth being explicit about:

```nginx
server {
    listen 443 ssl;
    server_name example.com;

    ssl_certificate     /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;         # disable older, insecure TLS versions
    ssl_prefer_server_ciphers off;

    add_header Strict-Transport-Security "max-age=63072000" always;  # HSTS
}
```

- `ssl_protocols TLSv1.2 TLSv1.3` — disables outdated, weaker TLS versions (1.0/1.1)
- **HSTS** (`Strict-Transport-Security`) tells browsers to _always_ use HTTPS for this domain going forward, even if a user types `http://` — protects against a downgrade attack on the very first request. Be cautious enabling this with a long `max-age` until you're confident HTTPS is fully working, since browsers will refuse to fall back to HTTP for the duration.

---

## Self-signed certificates for local development

```bash
openssl req -x509 -nodes -days 365 \
  -newkey rsa:2048 \
  -keyout selfsigned.key \
  -out selfsigned.crt \
  -subj "/CN=localhost"
```

```nginx
server {
    listen 443 ssl;
    ssl_certificate     /path/to/selfsigned.crt;
    ssl_certificate_key /path/to/selfsigned.key;
    # ...
}
```

Browsers will show a security warning for a self-signed certificate — expected and fine for local testing, never use one for a real production domain.

## Quick summary

- Terminating TLS at Nginx keeps Node simple — it only ever handles plain HTTP
- Certbot + Let's Encrypt is the standard free path to a real certificate, and handles renewal automatically
- Always redirect HTTP to HTTPS with a separate `server` block on port 80
- `ssl_protocols`/HSTS are worth setting explicitly rather than relying entirely on defaults
- Self-signed certificates are for local development only

## Next

`03-static-files-and-compression.md` covers serving assets directly from Nginx and compressing responses.
