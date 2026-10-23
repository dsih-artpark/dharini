#!/bin/bash
# Pulls the published images and (re)starts the stack on this machine.
#
#   ./deploy.sh [staging|production]            default: production
#   IMAGE_TAG=sha-abc1234 ./deploy.sh staging   run one specific build (rollback)
#   ./deploy.sh staging --build                 build from this checkout instead
#
# Needs docker-compose.yml, this script and a filled-in .env in this folder (see
# .env.example). Re-download docker-compose.yml first if you want the latest.
set -euo pipefail

PROFILE="${1:-production}"
BUILD="${2:-}"

case "$PROFILE" in
  staging|production) ;;
  *) echo "Usage: $0 [staging|production] [--build]" >&2; exit 1 ;;
esac

export IMAGE_TAG="${IMAGE_TAG:-$PROFILE}"

if [ ! -f .env ]; then
  echo "No .env here. Copy .env.example to .env and fill it in first." >&2
  exit 1
fi
# Optional data files (see geolens-data/README.md in the repository) are mounted
# from here; create the folder as the current user instead of letting Docker
# create it as root.
mkdir -p geolens-data

if docker ps &> /dev/null; then DOCKER="docker"; else DOCKER="sudo docker"; fi

PROFILES="--profile $PROFILE"

# Start the bundled PostgreSQL only when .env points the backend at it. Any other
# DB_HOST (for example an AWS RDS endpoint) is an external database.
DB_HOST="$(grep -E '^DB_HOST=' .env | tail -1 | cut -d= -f2- | sed -E "s/[[:space:]]+#.*$//; s/^[\"']//; s/[\"'][[:space:]]*$//; s/[[:space:]]+$//")"
case "$DB_HOST" in
  postgres|postgres16-postgis)
    PROFILES="$PROFILES --profile bundled-db"
    echo "Database: bundled PostgreSQL container"
    ;;
  *)
    echo "Database: external (${DB_HOST:-DB_HOST not set})"
    ;;
esac

# Keep the Flutter web app running once a build has been put in ./mobile-web
# (see the Mobile App page in the docs).
if [ -f mobile-web/index.html ]; then
  PROFILES="$PROFILES --profile mobile-web"
fi

# Also start Garage when .env points the backend at it (see deploy-readme.md).
if grep -qE "^S3_ENDPOINT=.*garage" .env 2>/dev/null; then
  PROFILES="$PROFILES --profile garage"
fi

echo "Deploying profile '$PROFILE' with image tag '$IMAGE_TAG'..."

if [ "$BUILD" = "--build" ]; then
  $DOCKER compose $PROFILES build
else
  $DOCKER compose $PROFILES pull
fi

# --wait returns once every service is running and healthy, and fails if one
# exits or stays unhealthy.
$DOCKER compose $PROFILES up -d --no-build --wait --wait-timeout 420

$DOCKER image prune -f > /dev/null
echo "Done. Status:"
$DOCKER compose $PROFILES ps
