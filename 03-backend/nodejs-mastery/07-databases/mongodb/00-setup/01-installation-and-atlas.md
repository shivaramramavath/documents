# Installation & MongoDB Atlas

Two ways to get a running MongoDB instance: install it locally, or create a free cluster on MongoDB Atlas (the official managed cloud service). Most real projects end up using Atlas even for development, but local installs are worth knowing too.

## Option 1: Install MongoDB locally

### macOS (via Homebrew)

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Windows

Download the MSI installer from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community) and run it — it installs MongoDB as a Windows service, starting automatically.

### Linux (Debian/Ubuntu)

```bash
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg
echo "deb [signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Verify it's running

```bash
mongosh
```

```
Current Mongosh Log ID: ...
Connecting to: mongodb://127.0.0.1:27017/
Using MongoDB: 7.0.x
```

If this connects without error, MongoDB is installed and running locally on the default port, `27017`.

### Local install via Docker (an alternative worth knowing)

```bash
docker run -d --name mongodb -p 27017:27017 mongo:7
```

A quick way to get a disposable local instance without installing MongoDB directly on your machine at all — consistent with the Docker guide's approach to running any service.

---

## Option 2: MongoDB Atlas (managed cloud)

Atlas is MongoDB's own managed database-as-a-service — no local install, no server management, and a genuinely useful free tier for learning and small projects.

### Creating a free cluster

1. Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new project, then a new cluster — choose the **M0 (free tier)** option
3. Pick a cloud provider and region (any is fine for learning; pick one close to you for lower latency)
4. Wait a few minutes for the cluster to provision

### Getting a connection string

Once the cluster is ready, Atlas provides a connection string:

```
mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
```

`mongodb+srv://` is a special connection string format Atlas uses — it automatically discovers all the nodes in your cluster via DNS, rather than needing every host listed explicitly (relevant once you're using a replica set, `13-replication/`).

### Required setup before connecting

Atlas requires two things configured before any connection succeeds, covered in full in `11-mongodb-atlas/02-access-control.md`:

- **A database user** — a username/password (or other auth method) with permission to access the cluster
- **Network access** — an IP allowlist; by default, nothing can connect until you explicitly permit an IP range (`0.0.0.0/0` for "allow from anywhere," fine for learning, not recommended for production)

---

## Local vs Atlas: which to use when

|                                     | Local install                          | Atlas                                        |
| ----------------------------------- | -------------------------------------- | -------------------------------------------- |
| Setup effort                        | Install + manage yourself              | Sign up, click through a wizard              |
| Cost                                | Free                                   | Free tier available, paid for real workloads |
| Offline access                      | Yes                                    | No — requires internet                       |
| Matches production                  | Only if production is also self-hosted | Yes, if production also uses Atlas           |
| Replication/sharding out of the box | No, needs manual setup                 | Yes, built into paid tiers                   |

A common real-world pattern: use a local instance (or a Dockerized one) for quick offline experiments, and Atlas for anything you're actually building toward deploying, since it removes an entire category of "getting MongoDB running in production" concerns later.

## Common mistakes

- **Forgetting to start the MongoDB service after a local install** — `mongosh` fails to connect with a connection-refused error if the `mongod` process isn't actually running.
- **Not configuring Atlas's network access allowlist** — a fully correct connection string still fails to connect if your IP isn't allowed through.
- **Using `0.0.0.0/0` (allow from anywhere) in a production Atlas project** — fine for learning, a real security gap for anything handling real data; see `12-security/`.
- **Confusing the `mongodb://` and `mongodb+srv://` connection string formats** — `+srv` is Atlas's DNS-based discovery format; a plain local install typically uses `mongodb://localhost:27017`.

## Quick summary

- Local install: works offline, needs manual setup and management, available via package managers or Docker
- Atlas: managed, needs a database user and network access configured before it will accept any connection, uses the `mongodb+srv://` connection string format
- Pick based on the project — local/Docker for quick experiments, Atlas for anything heading toward production

## Next

**`02-shell-and-compass.md`** covers actually connecting to and interacting with whichever instance you just set up.
