---
title: Nginx Configuration
description: Reverse proxy configuration for Dharini
---

Nginx serves as a reverse proxy for Dharini, routing traffic to the appropriate Docker containers and handling SSL termination.

## Installation

Install Nginx on your EC2 instance:

```bash
sudo apt-get update
sudo apt-get install -y nginx
```

Enable and start Nginx:

```bash
sudo systemctl enable nginx
sudo systemctl start nginx
```

## Configuration Files

Nginx configuration files are located in:
- `/etc/nginx/sites-available/` - Available site configurations
- `/etc/nginx/sites-enabled/` - Enabled site configurations (symlinks)

## Production Configuration

Create a new site configuration:

```bash
sudo nano /etc/nginx/sites-available/dharini-prod
```

### How the services are exposed

Nginx runs on the host and the containers publish their ports on the host (see `docker-compose.yml`). Nginx can therefore reach them on `127.0.0.1`. If Nginx runs in a container on the same Docker network instead, use the compose service names (`frontend`, `backend`, `mobile-web`, `garage`).

| Service | Port | Compose service |
|---|---|---|
| Web frontend (Next.js) | 3000 | `frontend` |
| Backend API (NestJS) | 4000 | `backend` |
| Flutter web build | 3002 (container port 80) | `mobile-web` |
| Garage S3 API (optional) | 3900 | `garage` |

Ports 3000, 4000 and 3002 are published on all interfaces, so block them in your firewall or security group and let only Nginx reach them. PostgreSQL, Redis, pgAdmin and Garage (3900-3903) listen on `127.0.0.1` only.

### The `/api` prefix

The backend has **no global route prefix**. It serves `/health`, `/media/upload-images`, `/sequencing/...` and so on, and Swagger at `/docs`. The `/api` prefix used in the examples below is added and removed by Nginx:

- `location /api/` with `proxy_pass http://127.0.0.1:4000/;` (note the trailing slash) strips `/api/` before forwarding. A browser request to `/api/health` reaches the backend as `/health`.
- Set `NEXT_PUBLIC_API_URL` to the public URL including `/api` (for example `https://dharini.example.org/api`). See [Environment Variables](/administrator-guide/environment-variables/).
- Swagger is then available at `/api/docs`.

If you give the API its own subdomain instead, proxy `/` and do not use a prefix.

### Path-Based Routing

One domain, with the services under different paths. Replace `dharini.example.org` with your domain.

```nginx
# Upload limit for the whole server. See "Request Size Limits" below.
client_max_body_size 50m;

server {
    server_name dharini.example.org;

    # Frontend - main application
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Redirect /api to the Swagger UI
    location = /api {
        return 301 /api/docs;
    }

    # Backend API. The trailing slash on proxy_pass strips the /api prefix.
    location /api/ {
        proxy_pass http://127.0.0.1:4000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Media uploads: up to MAX_FILE_ALLOW_UPLOAD files of 25 MB each
    location /api/media/upload-images {
        client_max_body_size 300m;
        proxy_pass http://127.0.0.1:4000/media/upload-images;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300;
        proxy_send_timeout 300;
    }

    listen 80;
}
```

**Important notes:**

1. **Path stripping for the API.** Client request `/api/users` reaches the backend as `/users`.
2. **API root redirect.** `/api` redirects to `/api/docs` (Swagger).
3. **Media uploads.** `POST /media/upload-images` takes up to `MAX_FILE_ALLOW_UPLOAD` files (default 10) of at most 25 MB each, so the worst case is about 250 MB. The location block above raises the limit for that route only.
4. **Sequencing webhook.** The genomics pipeline calls the backend at `POST /sequencing/pipeline/webhook`. The route is public (no login) and protected by an HMAC signature (`WEBHOOK_SECRET`). The pipeline must be able to reach it through Nginx, and `PIPELINE_CALLBACK_URL` must be the public URL of that route as the pipeline sees it. With the configuration above that is `https://dharini.example.org/api/sequencing/pipeline/webhook`. If you restrict `/api/` by IP, allow the pipeline. If the webhook cannot be delivered, runs are still completed by a reconciliation job, but only after a delay (see [Troubleshooting](/administrator-guide/troubleshooting/)).

### Flutter Web (mobile-web)

The `mobile-web` container serves the Flutter web build on port 3002. The build expects to be served from the root of a host, so give it its own subdomain:

```nginx
server {
    server_name app.dharini.example.org;

    location / {
        proxy_pass http://127.0.0.1:3002;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    listen 80;
}
```

The browser calls the API from this origin, so add `https://app.dharini.example.org` to `CORS_ORIGINS`.

### Documentation Site (static files)

The documentation is a static site. The `production-docs-deploy.yml` workflow builds it and copies the files to `/var/www/dharini-docs` on the server. Nginx serves them directly; no container is involved:

```nginx
server {
    server_name docs.dharini.example.org;

    root /var/www/dharini-docs;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    listen 80;
}
```

The site is built for the root of a host, so serve it from its own domain or subdomain rather than from a sub-path.

### Garage S3 (optional)

If you run the bundled Garage object store (`docker compose --profile garage up -d`) and browsers need to reach it, for example to upload sequencing files through presigned URLs, expose the S3 API on the same host under `/s3/`:

```nginx
    location /s3/ {
        client_max_body_size 6g;
        proxy_pass http://127.0.0.1:3900/;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_request_buffering off;
        proxy_read_timeout 600;
        proxy_send_timeout 600;
    }
```

Set `S3_ENDPOINT` so that the presigned URLs the backend returns point at a public address the browser can use. The bucket also needs a CORS rule allowing `PUT` from your web origin. With AWS S3 you do not need this block.

### Subdomain-Based Routing

Alternative layout using one subdomain per service:

```nginx
client_max_body_size 50m;

# Frontend
server {
    server_name dharini.example.org;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    listen 80;
}

# API (no prefix: NEXT_PUBLIC_API_URL=https://api.dharini.example.org)
server {
    server_name api.dharini.example.org;

    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /media/upload-images {
        client_max_body_size 300m;
        proxy_pass http://127.0.0.1:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300;
        proxy_send_timeout 300;
    }

    listen 80;
}
```

With this layout the webhook URL is `https://api.dharini.example.org/sequencing/pipeline/webhook`, and `CORS_ORIGINS` must list the frontend origin `https://dharini.example.org`.

## Enable the Configuration

Create a symlink to enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/dharini-prod /etc/nginx/sites-enabled/
```

Test the configuration:

```bash
sudo nginx -t
```

If the test passes, reload Nginx:

```bash
sudo systemctl reload nginx
```

## SSL Configuration with Certbot

Install Certbot:

```bash
sudo apt-get install -y certbot python3-certbot-nginx
```

Generate SSL certificates:

```bash
# For path-based routing (single domain)
sudo certbot --nginx -d dharini.example.org

# For subdomain-based routing (multiple domains)
sudo certbot --nginx -d dharini.example.org -d api.dharini.example.org
```

Certbot will automatically:
- Generate SSL certificates
- Update Nginx configuration
- Set up automatic renewal

Certbot adds the HTTPS `listen 443 ssl` block and certificate paths to your server block, and a second server block that redirects HTTP to HTTPS. Your `location` blocks stay as they are.

After enabling HTTPS, make sure `NEXT_PUBLIC_API_URL`, `PIPELINE_CALLBACK_URL` and `CORS_ORIGINS` use `https://` URLs.

## Certificate Renewal

Certbot sets up automatic renewal via cron. Test renewal:

```bash
sudo certbot renew --dry-run
```

## Advanced Configuration

### Request Size Limits

Nginx rejects any request body larger than `client_max_body_size` (default 1 MB) with `413 Request Entity Too Large`, before the backend sees it. Set it to at least the backend's own limits:

| Request | Backend limit | Nginx setting |
|---|---|---|
| JSON and form bodies (data imports, most API calls) | 50 MB | `client_max_body_size 50m;` at server level |
| `POST /media/upload-images` | 25 MB per file, `MAX_FILE_ALLOW_UPLOAD` files (default 10) | `300m` on that location |
| Sequencing input files (FASTA/FASTQ) | `SEQUENCING_MAX_UPLOAD_BYTES` (default 5 GB) | Not applicable: see below |

**Sequencing files do not pass through Nginx or the backend.** The browser asks the backend for a presigned URL (`POST /sequencing/uploads/presign`) and then uploads the file straight to S3. Only the small JSON requests go through Nginx. The exception is when you serve Garage through an `/s3/` location (see above); that location then needs a large `client_max_body_size`.

`MAX_FILE_ALLOW_UPLOAD` is the maximum number of files per request, not a size.

### Rate Limiting

Protect against abuse. The backend already throttles some sensitive routes itself (10 requests per minute per client),. The pipeline webhook should not be rate limited aggressively.

```nginx
# Define rate limit zone
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

server {
    # ... existing config ...

    location /api/ {
        limit_req zone=api_limit burst=20 nodelay;
        proxy_pass http://127.0.0.1:4000/;
        # ... other proxy settings ...
    }
}
```

### Logging

Custom log format:

```nginx
log_format detailed '$remote_addr - $remote_user [$time_local] '
                    '"$request" $status $body_bytes_sent '
                    '"$http_referer" "$http_user_agent" '
                    '$request_time';

server {
    access_log /var/log/nginx/dharini-access.log detailed;
    error_log /var/log/nginx/dharini-error.log warn;

    # ... rest of config ...
}
```

## Troubleshooting

### Test Configuration

```bash
sudo nginx -t
```

### View Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

### Reload Configuration

```bash
sudo systemctl reload nginx
```

### Restart Nginx

```bash
sudo systemctl restart nginx
```

### Check Status

```bash
sudo systemctl status nginx
```

## Security Headers

Do not add security headers for `/api/` in Nginx. The backend already sends them on every response through `helmet`:

- `X-Frame-Options: DENY` and a `Content-Security-Policy` with `frame-ancestors 'none'`
- `Strict-Transport-Security` with a one-year max-age (subdomains not included)
- `X-Content-Type-Options: nosniff`, and no `X-Powered-By`

If Nginx adds the same headers, the browser receives them twice, and conflicting values (for example `SAMEORIGIN` from Nginx and `DENY` from the backend) cause confusing behavior. Leave the API location alone.

The frontend and static docs do not get the backend's headers. If you want headers on those, add them to those locations only, with values compatible with the app:

```nginx
location / {
    # ... proxy settings ...
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

Test any Content-Security-Policy on the frontend carefully: it loads map tiles and S3 images from other origins.

## Next Steps

- [Database Setup](/administrator-guide/database-setup/) - Configure PostgreSQL and RDS
- [Troubleshooting](/administrator-guide/troubleshooting/) - Common issues and solutions
