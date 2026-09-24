# Load Balancing

Distributing requests across multiple Node instances — the infrastructure-level counterpart to `cluster` (`02-core-modules/10-cluster-and-worker-threads.md`), used when instances run as separate processes, containers, or even separate machines rather than forked from one parent process.

## Basic `upstream` block

```nginx
upstream node_app {
    server localhost:3001;
    server localhost:3002;
    server localhost:3003;
}

server {
    listen 80;
    location / {
        proxy_pass http://node_app;
        proxy_set_header Host $host;
        # ... other proxy headers, see 01-reverse-proxy-basics.md
    }
}
```

By default, Nginx round-robins requests across the three backends evenly.

---

## Load balancing strategies

```nginx
upstream node_app {
    least_conn;                # send to whichever backend has the fewest active connections
    server localhost:3001;
    server localhost:3002;
}
```

```nginx
upstream node_app {
    ip_hash;                    # same client IP always routes to the same backend
    server localhost:3001;
    server localhost:3002;
}
```

| Strategy | Behavior | Use when |
|---|---|---|
| Round-robin (default) | Even rotation across backends | Stateless backends, fairly uniform request cost |
| `least_conn` | Favors the least-busy backend | Requests vary a lot in how long they take |
| `ip_hash` | Same client always hits the same backend | Backends hold in-memory session state (see below) |

### Why `ip_hash` matters for session state

If your app keeps session data in memory rather than a shared store like Redis (`07-databases/redis/02-caching-and-sessions.md`), a client load-balanced to a *different* instance than the one holding their session will unexpectedly appear logged out. `ip_hash` avoids this by pinning a client to one backend — but the more robust fix is to move session state into Redis so it doesn't matter which instance handles a given request at all.

---

## Weighted load balancing

```nginx
upstream node_app {
    server localhost:3001 weight=3;   # gets 3x the traffic of the others
    server localhost:3002 weight=1;
    server localhost:3003 weight=1;
}
```

Useful when backends have different capacity (e.g. one is a bigger instance), or during a gradual rollout where you want a new version to receive a small fraction of traffic before fully cutting over.

---

## Health checks and failover

```nginx
upstream node_app {
    server localhost:3001 max_fails=3 fail_timeout=30s;
    server localhost:3002 max_fails=3 fail_timeout=30s;
    server localhost:3003 backup;       # only used if the others are all down
}
```

- `max_fails`/`fail_timeout` — after this many failed attempts, Nginx temporarily stops sending traffic to that backend for `fail_timeout`, then retries
- `backup` — a server only used when every non-backup server is unavailable

Open-source Nginx's health checking is this passive, failure-based kind — it doesn't proactively probe backends before something actually fails. Active health checks (proactively polling a `/health` endpoint before routing traffic) are an Nginx Plus feature, or handled by whatever's a layer above Nginx in a container orchestrator (Kubernetes readiness probes, for example — see `16-production/02-graceful-shutdown-and-health-checks.md`).

---

## Load balancing vs `cluster`: same goal, different layer

| | `cluster` (`02-core-modules/10-cluster-and-worker-threads.md`) | Nginx `upstream` |
|---|---|---|
| Scope | One machine, multiple processes | Any number of machines/containers |
| Managed by | Node itself | Infrastructure (Nginx, or an orchestrator) |
| Typical use | Using all cores on a single server | Scaling across multiple servers/containers, or fronting a `cluster`-based app too |

These aren't mutually exclusive — a common real setup is Nginx (or a cloud load balancer) distributing traffic across several **containers**, each of which might itself run a clustered Node process using every core on its own machine.

---

## In a containerized deployment

In practice, when running in Docker/Kubernetes, the load-balancing role described here is often played by the orchestrator itself (a Kubernetes `Service`, or a cloud load balancer in front of ECS tasks) rather than a hand-configured Nginx `upstream` block — but the underlying concept (spread requests across several running instances, detect and route around failures) is identical either way.

## Quick summary

- `upstream` blocks define a pool of backend instances Nginx distributes requests across
- Round-robin is the default; `least_conn` and `ip_hash` fit specific situations (uneven request cost, in-memory session affinity)
- `weight` skews traffic distribution, useful for uneven capacity or gradual rollouts
- Open-source Nginx does passive, failure-based health checking (`max_fails`/`fail_timeout`) rather than active probing
- This solves the same "use more capacity" problem as `cluster`, just at the infrastructure layer instead of within one Node process

## Next

`06-rate-limiting.md` covers stopping abusive traffic before it ever reaches Node.
