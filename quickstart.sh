#!/bin/bash
# Starts Dharini on this machine to try it out: http://localhost:3000
#
#   ./quickstart.sh            pull the published images
#   ./quickstart.sh --build    build the images from this checkout instead
#
# On the first run it creates .env with random secrets and a test login. That
# login uses a fixed one-time code and is for local use only: for a real
# server, follow the Administrator Guide and use ./deploy.sh.
set -euo pipefail
cd "$(dirname "$0")"

if docker ps &> /dev/null; then DOCKER="docker"; else DOCKER="sudo docker"; fi

set_var() {
  if grep -q "^$1=" .env; then
    sed -i.bak "s|^$1=.*|$1=$2|" .env && rm -f .env.bak
  else
    echo "$1=$2" >> .env
  fi
}

if [ -f .env ]; then
  echo ".env already exists, using it."
else
  cp .env.example .env
  set_var NODE_ENV staging
  set_var ALLOW_FIXED_OTP true
  set_var DB_PASSWORD "$(openssl rand -hex 16)"
  set_var JWT_SECRET "$(openssl rand -hex 32)"
  set_var CORS_ORIGINS http://localhost:3000
  set_var FRONTEND_PLATFORM http://localhost:3000/
  set_var NEXT_PUBLIC_APP_ENV local
  set_var NEXT_PUBLIC_API_URL http://localhost:4000
  set_var SUPER_ADMIN_EMAIL admin@example.com
  set_var SUPER_ADMIN_FIRST_NAME Admin
  set_var SUPER_ADMIN_LAST_NAME User
  echo "Created .env"
fi

PROFILE="--profile development"
if [ "${1:-}" = "--build" ]; then
  $DOCKER compose $PROFILE build
else
  $DOCKER compose $PROFILE pull
fi

# The first start loads reference data and can take a few minutes.
$DOCKER compose $PROFILE up -d --no-build --wait --wait-timeout 600

cat <<'MSG'

Dharini is running.
  Web app   http://localhost:3000
  API docs  http://localhost:4000/docs
  Sign in   admin@example.com  (one-time code: 123456)
  Stop      docker compose --profile development down
MSG
