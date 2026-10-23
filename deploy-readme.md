# Dharini Windows Server Deployment Guide

This guide walks you through setting up the application natively on a Windows 11 Pro server using WSL 2 (Windows Subsystem for Linux). Docker runs directly inside Ubuntu on WSL 2, without Docker Desktop.

We replace AWS S3 with **Garage**, an open-source, local S3-compatible storage engine.

The backend and web images are not built on the server. GitHub Actions publishes them to `dsihartpark/dharini-backend` and `dharini-frontend` (tags `staging`, `production` and `sha-<commit>`) when changes are merged into the `staging` or `production` branch, and `./deploy.sh` pulls them.

---

## 1. Prerequisites (Windows 11 Setup)

On your Windows 11 Pro server, enable WSL 2 and install Ubuntu.

1. Click **Start**, search for `PowerShell`. Right-click → **Run as Administrator**.
2. Run:

   ```powershell
   wsl --install
   ```

   > If WSL is already installed, run `wsl --install -d Ubuntu` or `wsl --update`.

3. **Reboot** the server if prompted.
4. Open the **Ubuntu** app from the Start Menu. It will initialize and ask you to create a UNIX username and password. **Remember this password** — it is your `sudo` password throughout this guide.

---

## 2. Create a Non-Root User (Recommended)

It is recommended to run the application as a non-root user. If you are currently logged in as `root`, follow these steps to create a new user with `sudo` privileges:

1. **Create the user** (replace `dharini` with your preferred username):

   ```bash
   adduser dharini
   ```

2. **Add the user to the `sudo` group:**

   ```bash
   usermod -aG sudo dharini
   ```

3. **Switch to the new user:**

   ```bash
   su - dharini
   ```

---

## 3. Server Setup (One-time Only)

The repository is public, so no SSH key or token is needed to clone it.

1. **Install Git and clone the repository:**

   ```bash
   sudo apt-get update && sudo apt-get install -y git
   git clone https://github.com/dsih-artpark/dharini.git
   cd dharini
   ```

2. **Configure your environment file before running setup:**

   ```bash
   cp .env.example .env
   nano .env
   ```

   Fill in **at minimum**:
   - `DB_PASSWORD` — a strong password for PostgreSQL
   - `JWT_SECRET` — a long random string (e.g. run `openssl rand -hex 32`)
   - `NEXT_PUBLIC_API_URL` — the public URL of the API through Nginx, including `/api`, e.g. `http://192.168.1.100/api` (see Section 5)
   - `CORS_ORIGINS` — the browser origin of the web app, e.g. `http://192.168.1.100` (scheme and host, no path). The backend will not start without it.

3. **Run the setup script:**

   ```bash
   ./setup.sh
   ```

   This will:
   - Install Docker CE (not Docker Desktop) directly inside Ubuntu, if it is not already installed
   - Generate the `rpc_secret` and `admin_token` in `garage.toml` if they are still placeholders
   - Start the Garage S3 service and create the `dharini-bucket` bucket
   - Generate S3 access/secret keys and write them, with the Garage endpoint, to `.env`

   > **Note:** If `docker` commands fail with "permission denied", `setup.sh` and `deploy.sh` fall back to `sudo docker`. To avoid `sudo` permanently, **log out and log back into** the Ubuntu terminal after setup.

---

## 4. Deployment

To deploy or update the application, run:

```bash
git pull            # optional: gets the latest docker-compose.yml and scripts
./deploy.sh production
```

`deploy.sh` no longer runs `git pull` itself, so pull first if you want the latest `docker-compose.yml`.

This script will:

1. Pull the published images for the `production` tag
2. Start Garage as well, if `.env` has `S3_ENDPOINT` pointing at `garage` (as `setup.sh` configures)
3. Start the stack and wait (`--wait`) until every service is healthy. The first start can take a few minutes while the backend loads reference data and runs migrations.

Variations:

- **Run one specific build** (for example to roll back): `IMAGE_TAG=sha-abc1234 ./deploy.sh production`
- **Build from this checkout instead of pulling:** `./deploy.sh production --build`
- **Staging:** `./deploy.sh staging`

The web image reads the `NEXT_PUBLIC_*` variables when the container starts. After changing them in `.env`, run `./deploy.sh production` again; no rebuild is needed.

---

## 5. Making the Application Accessible (Nginx Reverse Proxy)

The frontend (`3000`) and backend (`4000`) listen on all interfaces inside WSL2. PostgreSQL, Redis, pgAdmin and Garage listen on `127.0.0.1` only. Put Nginx in front of the open ports and do not forward them to the network. To expose the application on the Windows server's network interface:

### Install Nginx inside Ubuntu

```bash
sudo apt-get update && sudo apt-get install -y nginx
```

### Remove the default config

To prevent the default Nginx welcome page from conflicting with your application, remove the default site symbolic link:

```bash
sudo rm /etc/nginx/sites-enabled/default
```

### Create a site config

```bash
sudo nano /etc/nginx/sites-available/dharini
```

Paste the following (replace `YOUR_DOMAIN_OR_IP` with your actual domain name if using SSL, or server IP):

```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN_OR_IP;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:4000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # S3 Storage (Garage)
    location /s3/ {
        proxy_pass http://localhost:3900/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 100M; 
    }
}
```

### Enable and start Nginx

```bash
sudo ln -sf /etc/nginx/sites-available/dharini /etc/nginx/sites-enabled/
sudo nginx -t
sudo service nginx start
```

---

## 6. SSL Configuration (Certbot)

If you have a domain name pointing to your server's public IP, you can use Certbot to automatically set up SSL (HTTPS).

> [!IMPORTANT]
> Ensure port **80** and **443** are open in the Windows Firewall and forwarded to WSL2 (see Section 8) before running Certbot.

1. **Install Certbot and Nginx plugin:**

   ```bash
   sudo apt-get install -y certbot python3-certbot-nginx
   ```

2. **Run Certbot:**

   ```bash
   sudo certbot --nginx -d YOUR_DOMAIN
   ```

3. **Follow the prompts:** Certbot will ask for an email and whether you want to redirect HTTP to HTTPS (choose **Redirect**).

4. **Verify Auto-renewal:**
   The installation automatically sets up a cron job for renewal. You can test it with:

   ```bash
   sudo certbot renew --dry-run
   ```

---

## 7. WSL2 Auto-Start on Windows Boot

By default, WSL2 does not start automatically when Windows boots. To fix this:

### Method A — Windows Task Scheduler (Recommended)

1. Open **Task Scheduler** on Windows (search in Start Menu)
2. Click **Create Task**
3. **General tab:** Name it `Start WSL2 Dharini`, check **Run whether user is logged on or not**
4. **Triggers tab:** New trigger → **At startup**
5. **Actions tab:** New action:
   - Program: `wsl.exe`
   - Arguments: `-u root service docker start`
6. Click **OK** and enter your Windows admin password

### Method B — Startup Script

Create a file `C:\Users\<YourUser>\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup\start-wsl.bat` with:

```bat
wsl -u root service docker start
wsl -u root service nginx start
```

This runs silently when Windows boots and ensures both Docker and Nginx are running inside WSL2.

---

## 8. Windows Firewall — Opening Ports

WSL2 runs on an internal virtual network. To allow traffic from other machines on your LAN (or from the internet), you need to:

1. **Open PowerShell as Administrator** on Windows
2. Add firewall rules for the required ports:

   ```powershell
   # Allow HTTP (Nginx)
   New-NetFirewallRule -DisplayName "Dharini HTTP" -Direction Inbound -Protocol TCP -LocalPort 80 -Action Allow

   # Allow HTTPS (if you set up SSL later)
   New-NetFirewallRule -DisplayName "Dharini HTTPS" -Direction Inbound -Protocol TCP -LocalPort 443 -Action Allow
   ```

3. **Forward ports from Windows to WSL2** (WSL2 has a separate IP):

   ```powershell
   # Get the WSL2 IP
   $wslIp = (wsl hostname -I).Trim()
   Write-Host "WSL2 IP: $wslIp"

   # Forward port 80 from Windows to WSL2 Nginx
   netsh interface portproxy add v4tov4 listenaddress=0.0.0.0 listenport=80 connectaddress=$wslIp connectport=80

   # Forward port 443 from Windows to WSL2 Nginx (if you set up SSL)
   netsh interface portproxy add v4tov4 listenaddress=0.0.0.0 listenport=443 connectaddress=$wslIp connectport=443
   ```

   > **Note:** The WSL2 IP changes on every reboot. If you want a permanent setup, use a script that re-runs these commands at startup, or configure a static internal IP via `.wslconfig`.

---

## 9. Mobile App Setup & Deployment (Ubuntu Server)

The mobile application is built using Flutter. We use **FVM (Flutter Version Management)** to ensure the exact Flutter version specified in the project is used.

### Mobile Setup (One-time Only)

1. **Configure the Mobile Environment:**

   Ensure you have a `.env` file in the `mobile/` directory with the necessary API keys (`MAP_API_KEY`, `API_BASE_URL`, etc.).

2. **Run the Mobile Setup Script:**

   ```bash
   chmod +x setup-mobile.sh deploy-mobile.sh
   ./setup-mobile.sh
   ```

   This script will:

   - Install Java 17, `jq`, and other system dependencies.
   - Install a base Flutter SDK and the **FVM** tool.
   - Automatically download the specific Flutter version defined in `mobile/.fvmrc`.
   - Install **Melos** and bootstrap the multi-package workspace.

### Mobile Deployment (Building the APK)

To build the APK on this server:

```bash
./deploy-mobile.sh
```

This script will:

1. Generate the necessary code (Domain schema and Barrel files).
2. Build the release APK and the Flutter web build using the FVM-managed Flutter version.
3. Rename the APK using the version from `pubspec.yaml` (e.g., `dharini-v0.2.3.apk`) in `mobile/build/app/outputs/flutter-apk/`.
4. Copy the web build into `mobile-web/` and make sure the `mobile-web` container is running.

The script stops if `mobile/.env` or `mobile/android/app/release-keystore.jks` is missing.

The script does not publish the APK. To distribute it, use the **Mobile CI** workflow (it publishes a GitHub Release) or host the file yourself, then set `NEXT_PUBLIC_APK_DOWNLOAD_URL` in `.env`. See the [Mobile app](https://dharini.artpark.ai/administrator-guide/mobile-app/) page.

---

## System Maintenance (Future Reference)

All commands are run inside the **Ubuntu** terminal.

- **See running services:**

  ```bash
  docker compose --profile production --profile bundled-db ps
  ```

- **View backend logs:**

  ```bash
  docker compose logs -f backend
  ```

- **Stop the application:**

  ```bash
  docker compose --profile production --profile bundled-db --profile garage down
  ```

- **Start or update the application (pull images and restart):**

  ```bash
  ./deploy.sh production
  ```

- **Restart Nginx (after config changes):**

  ```bash
  sudo service nginx restart
  ```
