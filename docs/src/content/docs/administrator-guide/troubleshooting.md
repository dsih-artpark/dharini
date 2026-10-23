---
title: Troubleshooting
description: Common issues and solutions for Dharini deployment
---

This guide covers common issues encountered when deploying and running Dharini.

## Docker Issues

### Containers Won't Start

**Problem**: Services fail to start or immediately exit

**Check service status**:
```bash
docker ps -a
docker logs backend
docker logs frontend
```

**Common causes**:

1. **Port conflicts** - Another service using ports 3000 (frontend), 3002 (mobile-web), 4000 (backend), 5432 (PostgreSQL) or 6379 (Redis)
   ```bash
   # Check what's using a port
   sudo lsof -i :4000

   # Change ports in docker-compose.yml if needed
   ```

2. **Environment variables missing**
   ```bash
   # Verify .env file exists and has required variables
   cat .env | grep DB_HOST
   ```

3. **Docker daemon not running**
   ```bash
   sudo systemctl status docker
   sudo systemctl start docker
   ```

### Backend Container Restarting

**Problem**: Backend container in restart loop

**Check logs**:
```bash
docker logs backend --tail 100
```

**Common issues**:

1. **Database connection failed**
   - Verify `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD` in `.env`
   - For RDS, ensure SSL is enabled (automatic in production)
   - Check RDS security group allows EC2 access

2. **Missing required variables or failed migration** - see [Backend Fails to Start](#backend-fails-to-start) below.

3. **Redis connection failed**
   - Verify Redis container is running: `docker ps | grep redis`
   - Check `REDIS_HOST=redis` in `.env`

### Backend Fails to Start

**Problem**: The backend exits at startup, or stays "Up" but nothing answers on port 4000.

The backend reads some variables at startup and refuses to run without them. All variables are described in [Environment Variables](/administrator-guide/environment-variables/). Startup order outside development: run migrations, build the app, check `CORS_ORIGINS`, run the seeder, start listening.

**Required variables that stop the backend**:

| Variable | Symptom in `docker logs backend` | Container state |
|---|---|---|
| `JWT_SECRET` | `Configuration key "JWT_SECRET" does not exist` | Exits, restarts in a loop |
| `S3_BUCKET` | same message naming `S3_BUCKET` | Exits, restarts in a loop |
| `PIPELINE_URL`, `PIPELINE_CALLBACK_URL`, `WEBHOOK_SECRET` | same message naming the missing key | Exits, restarts in a loop |
| `QUEUE` | Queue/Redis dependency-injection error at startup (the name of the job queue must be set) | Exits, restarts in a loop |
| `CORS_ORIGINS` | `CORS_ORIGINS must be set outside development` | **Stays "Up" with nothing listening** (see below) |

`PIPELINE_API_KEY` is optional. `CORS_ORIGINS` must be a comma-separated list of bare origins such as `https://dharini.example.org`. A path, a trailing slash after a path, or `*` is rejected with a `CORS_ORIGINS: ... is not a valid origin` error.

**Stays "Up" but nothing listens.** The `CORS_ORIGINS` check, and any error thrown by the data seeder, happen after the process has started. The error is logged, but the process is not stopped, so Docker does not restart the container and requests to port 4000 are refused. We have not run this case end to end; this is read from `main.ts`. The container's Docker healthcheck calls `/health`, so it is reported as `unhealthy` once the 300-second start period has passed, and `./deploy.sh` (which waits for healthy containers) fails. Check the logs and the API itself:

```bash
docker logs backend --tail 50
curl -i http://localhost:4000/health
```

`/health` should return `200` with `{"status":"ok", ...}`.

**Fix**: set the missing variable in `.env`, then recreate the container so it reads the new value (a plain `restart` does not re-read `env_file`):

```bash
docker compose --profile production up -d backend
```

**Migration failed**: the log shows `Migration failed` followed by the database error, and the backend exits. See [Migration Failures](#migration-failures).

### Frontend Container Unhealthy

**Problem**: Frontend shows as "unhealthy" status

**This is often normal during**:
- Initial start
- After an update
- Server Action cache mismatches

**Solutions**:

1. **Wait 1-2 minutes** - Health check may pass after warm-up

2. **Restart frontend**:
   ```bash
   docker compose --profile production restart frontend
   ```

3. **Clear browser cache** - Hard refresh (`Ctrl+Shift+R`)

4. **Recreate all containers**:
   ```bash
   docker compose --profile production --profile bundled-db down
   ./deploy.sh production
   ```

## Database Issues

### Cannot Connect to RDS

**Problem**: "no pg_hba.conf entry for host" or connection timeout

**Solutions**:

1. **Use SSL for RDS connections**:
   ```bash
   PGSSLMODE=require psql -h your-rds-endpoint -U postgres -d postgres
   ```

2. **Check security group**:
   - RDS security group must allow port 5432 from EC2
   - Verify EC2 security group ID or private IP is allowed

3. **Verify RDS endpoint**:
   ```bash
   # Test DNS resolution
   nslookup your-database-instance.xxxxxxxxx.region.rds.amazonaws.com

   # Test connectivity
   nc -zv your-database-instance.xxxxxxxxx.region.rds.amazonaws.com 5432
   ```

4. **Check credentials**:
   - Verify username and password are correct
   - Try connecting from another tool (pgAdmin, DBeaver)

### PostGIS Extension Missing

**Problem**: Migrations fail with "type 'geometry' does not exist"

**Solution**:

Connect to RDS and install PostGIS:

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### Migration Failures

**Problem**: The backend exits at startup with `Migration failed` in the logs.

Migrations run automatically every time the backend starts, in every environment except `NODE_ENV=development` (which uses schema sync instead). There is no separate migration command to run. A failed migration stops the backend, so it restarts in a loop until the cause is fixed.

**Check**:

1. **Read the error**:
   ```bash
   docker logs backend 2>&1 | grep -B2 -A15 "Migration failed"
   ```

2. **Verify database connection**:
   ```bash
   docker exec -it backend env | grep DB_
   ```

3. **See which migrations have run**:
   ```sql
   SELECT id, "timestamp", name FROM migrations ORDER BY id DESC LIMIT 10;
   ```

4. **Common causes**:
   - PostGIS extension missing (see above)
   - Database user lacks permission to create tables or extensions
   - A previous run was interrupted, or the schema was changed by hand, so a migration conflicts with objects that already exist

**Fix**: correct the cause, then restart the backend. It will run the pending migrations again. Each migration runs in a transaction, so a failed one normally leaves no partial changes. Take a database backup before editing the `migrations` table by hand; only do that if you know the migration's changes are already in place.

## Network and Nginx Issues

### 502 Bad Gateway

**Problem**: Nginx returns 502 error

**Causes**:

1. **Backend not running**:
   ```bash
   docker ps | grep backend
   docker logs backend
   ```

2. **Wrong upstream address** in Nginx config:
   ```bash
   # The containers publish ports on the host, so 127.0.0.1 should work
   curl -i http://127.0.0.1:4000/health

   # Update nginx config to match
   sudo nano /etc/nginx/sites-available/dharini-prod
   ```

   If the backend container is "Up" but this `curl` is refused, the backend did not finish starting. See [Backend Fails to Start](#backend-fails-to-start).

3. **Firewall blocking ports**:
   ```bash
   # Check if ports are listening
   sudo netstat -tulpn | grep -E ':(3000|3002|4000)'
   ```

### 504 Gateway Timeout

**Problem**: Requests time out

**Solutions**:

1. **Increase Nginx timeout**:
   ```nginx
   location /api/ {
       proxy_read_timeout 300;
       proxy_connect_timeout 300;
       proxy_send_timeout 300;
       # ... other settings
   }
   ```

2. **Check backend performance**:
   ```bash
   docker stats backend
   ```

### SSL Certificate Errors

**Problem**: Certificate not working or expired

**Solutions**:

1. **Test renewal**:
   ```bash
   sudo certbot renew --dry-run
   ```

2. **Force renewal**:
   ```bash
   sudo certbot renew --force-renewal
   ```

3. **Regenerate certificate**:
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

### API 404 Errors

**Problem**: `/api/` requests return 404

**Check**:

1. **Nginx path configuration**:
   ```nginx
   # Strips /api/ prefix
   location /api/ {
       proxy_pass http://127.0.0.1:4000/;  # Trailing slash important!
   }
   ```

2. **Backend routes**:
   - The backend has no `/api` prefix. Its routes are `/health`, `/users`, and so on.
   - Nginx strips `/api/` before forwarding.

3. **Test directly**:
   ```bash
   # Bypass Nginx - the public health check
   curl http://localhost:4000/health
   ```

   Other routes such as `/users` return `401 Unauthorized` without a token, because every route requires login except `/health`, the login/OTP routes and the pipeline webhook. A `401` from the backend means it is running; it is not an error in itself.

### Browser CORS Errors

**Problem**: The browser console shows `blocked by CORS policy` or `No 'Access-Control-Allow-Origin' header`, but the same request works with `curl`.

**Cause**: The backend only allows browser origins listed in `CORS_ORIGINS`. Requests with no `Origin` header (the mobile app, server-side calls, `curl`, the pipeline webhook) are not affected, which is why only the browser fails.

**Fix**:

1. Add the exact origin the browser shows in the address bar, with scheme and port and no path or trailing slash, for example `https://dharini.example.org`. List every browser app that calls the API, including the Flutter web build (mobile-web) if you serve it.
   ```bash
   CORS_ORIGINS=https://dharini.example.org,https://app.dharini.example.org
   ```
2. Recreate the backend so it reads the change: `docker compose --profile production up -d backend`.
3. Check there is no second `Access-Control-Allow-Origin` header added by Nginx. Let the backend handle CORS.

### Uploads Fail with 413

**Problem**: Uploading images or importing a data file fails with `413 Request Entity Too Large`.

**Cause**: Nginx's default `client_max_body_size` is 1 MB. The backend accepts 50 MB request bodies and, for `POST /media/upload-images`, 25 MB per file.

**Fix**: raise `client_max_body_size` in the Nginx server block and reload. See [Request Size Limits](/administrator-guide/nginx-configuration/#request-size-limits). A `413` that comes from the backend itself (a JSON body above 50 MB, or a file above 25 MB) has to be reduced on the client side.

## Performance Issues

### High CPU Usage

**Check resource usage**:
```bash
docker stats
```

**Common causes**:

1. **Database queries** - Check slow query log
2. **Infinite loops** in background jobs
3. **Memory leaks** - Monitor over time

**Solutions**:

1. **Scale EC2 instance** - Upgrade to larger instance type
2. **Optimize queries** - Add indexes, use EXPLAIN ANALYZE
3. **Restart services**:
   ```bash
   docker compose --profile production restart
   ```

### Out of Memory

**Problem**: Services crash with OOM errors

**Check memory**:
```bash
free -h
docker stats
```

**Solutions**:

1. **Increase EC2 instance memory**
2. **Add swap space** (temporary):
   ```bash
   sudo fallocate -l 2G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   ```

3. **Reduce Docker memory limits** in docker-compose.yml

### Slow API Responses

**Debug**:

1. **Check database performance**:
   ```sql
   SELECT query, calls, mean_exec_time FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;
   ```

2. **Monitor RDS metrics** in CloudWatch

3. **Check Redis connectivity**:
   ```bash
   docker exec -it redis redis-cli ping
   ```

## Application Issues

### Login Not Working

**Problem**: Cannot log in with phone or email OTP

**Check**:

1. **Super admin user exists**:
   ```sql
   SELECT u.id, u.email, r.name AS role
   FROM users u
   JOIN user_roles ur ON ur."userId" = u.id
   JOIN roles r ON r.id = ur."roleId"
   WHERE r.name = 'super-admin';
   ```

2. **Email OTP**:
   - Check `SMTP_HOST`/`SMTP_USER`/`SMTP_PASS`
   - Check `EMAIL_FROM` is verified with your email provider
   - View backend logs for email send errors

3. **SMS (phone) OTP**:
   - `SMS_PROVIDER` selects the sender. The default is `twilio`. Set it to `console` to send nothing: the backend only logs a masked "would send SMS" line, which is useful in development but means no SMS ever arrives.
   - With `twilio`, check `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN` and `TWILIO_FROM_NUMBER`, and that the Twilio account can send to the destination country.
   - Look for Twilio errors in `docker logs backend`.

4. **Testing without a real OTP**: `ALLOW_FIXED_OTP=true` makes every OTP `123456`. Use it only on a test system. It is ignored when `NODE_ENV=production`, so it cannot be switched on in production by mistake.

5. **Too many attempts**: the login/OTP routes are rate limited (10 requests per minute per client). Wait a minute and retry.

6. **Database connection**:
   ```bash
   docker logs backend | grep -i "database"
   ```

### File Upload Failing

**Problem**: Cannot upload images or files

**Check**:

1. **S3 credentials**:
   ```bash
   # Test from backend container
   docker exec -it backend env | grep S3_
   ```

2. **S3 bucket permissions**:
   - Verify IAM user has PutObject permission
   - Check bucket policy

3. **File limits**:
   - Nginx: `client_max_body_size` (see [Uploads Fail with 413](#uploads-fail-with-413))
   - Application: files are limited to 25 MB each. `MAX_FILE_ALLOW_UPLOAD` is the maximum number of files per request (default 10), not a size.

4. **Backend logs**:
   ```bash
   docker logs backend | grep -i "upload"
   ```

### Maps Not Loading

**Problem**: Maps or geospatial features not working

**Check**:

1. **PostGIS installed**:
   ```sql
   SELECT PostGIS_version();
   ```

2. **Spatial data**:
   ```sql
   SELECT id, name, ST_AsText(coordinates) FROM locations WHERE coordinates IS NOT NULL LIMIT 5;
   ```

3. **Frontend map library** loaded (check browser console)

### GeoLens Layers Empty After Startup

**Problem**: Right after a first deploy or a fresh database, GeoLens map layers show no data.

**Cause**: The backend loads the GeoLens reference layers (hundreds of thousands of rows) in the background after it starts listening, so the API is available before the data is. Failures are logged and do not stop the backend.

**Fix**: wait for it to finish; this can take several minutes on a new database. Follow progress with:

```bash
docker logs backend -f | grep -i geolens
```

If the log shows `GeoLens seeding failed`, fix the reported error (usually database permissions, a missing PostGIS extension or low disk space) and restart the backend. Seeding does not run when `NODE_ENV=development`.

### Mobile App Maps Are Blank

**Problem**: Map screens in the mobile app show grey or empty tiles.

**Cause**: The default map tiles come from Stadia Maps and need an API key. Without `MAP_API_KEY` in the mobile app's `.env` at build time, tile requests are rejected.

**Fix**: set `MAP_API_KEY` in `mobile/.env` (see `mobile/.env.example`), rebuild the app, and check the key is valid for your domain or app in the Stadia Maps dashboard.

### Sequencing Runs Stuck

**Problem**: A sequencing run stays in "Submitted" or "Processing" long after the pipeline finished.

**How results arrive**: The pipeline reports completion by calling the backend webhook, `POST /sequencing/pipeline/webhook` (public, signed with `WEBHOOK_SECRET`). As a safety net, a reconciliation job runs every 10 minutes and asks the pipeline about runs that have been active for more than `SEQUENCING_RECONCILE_AFTER_S` seconds (default 3600, one hour).

**Check**:

1. **The webhook is reachable from the pipeline**. `PIPELINE_CALLBACK_URL` must be the public URL of that route as the pipeline sees it. Behind the Nginx `/api/` prefix that is `https://dharini.example.org/api/sequencing/pipeline/webhook`. A localhost or private URL will not work from a pipeline running elsewhere.
2. **Nginx or a firewall is not blocking** the pipeline's requests. Check the Nginx access log for `POST .../sequencing/pipeline/webhook` and its status.
3. **`WEBHOOK_SECRET` matches** the secret configured in the pipeline. A mismatch shows as rejected signatures in the backend logs.
4. **`PIPELINE_URL` and `PIPELINE_API_KEY`** are correct, so the backend can submit runs and the reconciliation job can query them.
5. **Wait for reconciliation**. If the webhook cannot work (for example in local testing), runs reach their final state only after the reconcile window plus up to 10 minutes. Lower `SEQUENCING_RECONCILE_AFTER_S` to shorten this.

## Deployment Issues

### Deployment Files Will Not Download

**Problem**: `curl` fails when you fetch `docker-compose.yml` or `deploy.sh`, or the file you get is out of date

1. Check the URL and branch: the files come from `https://raw.githubusercontent.com/dsih-artpark/dharini/<branch>/`, where `<branch>` is `production` or `staging`.
2. A forked or renamed repository needs its own address in the URL.
3. Make sure the downloaded files are not empty (`ls -l docker-compose.yml deploy.sh`) and that `deploy.sh` is executable (`chmod +x deploy.sh`).

### Image Pull Fails

**Problem**: `./deploy.sh` fails while pulling, or the backend or frontend runs old code

The server does not build images; it pulls `dharini-backend` and `dharini-frontend` from `dsihartpark` on Docker Hub (or `IMAGE_REGISTRY`). They are published when a pull request is merged into `staging` or `production`.

1. **Check the publish run finished** in GitHub Actions ("Publish Docker images") for the commit you expect. Until it does, the tag still points at the previous build.
2. **Check the tag**: `IMAGE_TAG` defaults to the profile name. A leftover `IMAGE_TAG` in your shell or `.env` makes the server run that tag.
3. **Disk space full**:
   ```bash
   df -h
   docker system prune -a
   ```
4. **Build from the checkout instead** (needs more memory than running the images):
   ```bash
   ./deploy.sh production --build
   ```

## Monitoring and Logs

### View All Logs

```bash
# All services
docker compose logs -f

# Specific service
docker logs -f backend
docker logs -f frontend --tail 100

# Since specific time
docker logs backend --since 30m
```

### System Resources

```bash
# Disk usage
df -h
du -sh /var/lib/docker

# Memory
free -h

# Docker stats
docker stats

# Processes
top
htop  # if installed
```

### Network Debugging

```bash
# Test port connectivity
nc -zv your-domain.com 443

# DNS resolution
nslookup your-domain.com

# Trace route
traceroute your-domain.com

# Check listening ports
sudo netstat -tulpn
```

## Getting Help

If issues persist:

1. **Check logs** for specific error messages
2. **Search issues** on GitHub: https://github.com/dsih-artpark/dharini/issues
3. **Create new issue** with:
   - Error logs
   - Environment details (OS, Docker version)
   - Steps to reproduce
4. **Contact** the development team

## Preventive Measures

1. **Regular backups** - Database and configuration
2. **Monitor disk space** - Set up alerts
3. **Update regularly** - Pull latest code weekly
4. **Test in staging** before production updates
5. **Document changes** to configuration
6. **Monitor logs** for errors and warnings

## Quick Fixes Checklist

When something breaks, try these in order:

1. ☐ Check Docker containers: `docker ps`
2. ☐ View logs: `docker logs backend`
3. ☐ Restart services: `docker compose restart`
4. ☐ Check .env file variables
5. ☐ Verify database connection
6. ☐ Test Nginx config: `sudo nginx -t`
7. ☐ Check security groups (AWS)
8. ☐ Review recent changes: `git log`
9. ☐ Pull and redeploy if needed: `./deploy.sh production`
10. ☐ Check disk space: `df -h`
