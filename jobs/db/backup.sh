#!/usr/bin/env bash
set -euo pipefail

# Default Configuration
DEFAULT_CONTAINER="postgres16-postgis"
DEFAULT_DB_NAME="postgres"
DEFAULT_DB_USER="postgres"
DEFAULT_DB_SCHEMA="public"
DEFAULT_BACKUP_DIR="./pg_backups"

# Initialize with defaults
CONTAINER="$DEFAULT_CONTAINER"
DB_NAME="$DEFAULT_DB_NAME"
DB_USER="$DEFAULT_DB_USER"
DB_SCHEMA="$DEFAULT_DB_SCHEMA"
BACKUP_DIR="$DEFAULT_BACKUP_DIR"

usage() {
  cat <<EOF
Usage: $(basename "$0") [OPTIONS]

Create a PostgreSQL database backup using pg_dump via Docker.

Options:
  -c CONTAINER   Docker container name (default: $DEFAULT_CONTAINER)
  -d DATABASE    Database name (default: $DEFAULT_DB_NAME)
  -u USER        Database user (default: $DEFAULT_DB_USER)
  -s SCHEMA      Database schema (default: $DEFAULT_DB_SCHEMA)
  -o OUTPUT_DIR  Backup output directory (default: $DEFAULT_BACKUP_DIR)
  -h             Show this help message

Examples:
  $(basename "$0")                          # Use all defaults
  $(basename "$0") -c my_postgres -d mydb   # Custom container and database
  $(basename "$0") -o /backups              # Custom backup directory
EOF
  exit 0
}

# Parse command-line options
while getopts "c:d:u:s:o:h" opt; do
  case $opt in
    c) CONTAINER="$OPTARG" ;;
    d) DB_NAME="$OPTARG" ;;
    u) DB_USER="$OPTARG" ;;
    s) DB_SCHEMA="$OPTARG" ;;
    o) BACKUP_DIR="$OPTARG" ;;
    h) usage ;;
    \?)
      echo "Error: Invalid option -$OPTARG" >&2
      echo "Use -h for help" >&2
      exit 1
      ;;
    :)
      echo "Error: Option -$OPTARG requires an argument" >&2
      exit 1
      ;;
  esac
done

# Verify Docker is available
if ! command -v docker &>/dev/null; then
  echo "Error: Docker is not installed or not in PATH" >&2
  exit 1
fi

# Verify container exists and is running
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
  echo "Error: Container '$CONTAINER' is not running" >&2
  echo "Available running containers:" >&2
  docker ps --format '  {{.Names}}' >&2
  exit 1
fi

# Create backup directory if it doesn't exist
if ! mkdir -p "$BACKUP_DIR" 2>/dev/null; then
  echo "Error: Cannot create backup directory '$BACKUP_DIR'" >&2
  exit 1
fi

# Check if backup directory is writable
if [ ! -w "$BACKUP_DIR" ]; then
  echo "Error: Backup directory '$BACKUP_DIR' is not writable" >&2
  exit 1
fi

TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_data_${DB_SCHEMA}_${TIMESTAMP}.dump"

echo "Starting backup..."
echo "  Container: $CONTAINER"
echo "  Database:  $DB_NAME"
echo "  User:      $DB_USER"
echo "  Schema:    $DB_SCHEMA"
echo "  Output:    $BACKUP_FILE"

if docker exec -i "$CONTAINER" pg_dump -U "$DB_USER" -Fc -a --schema="$DB_SCHEMA" "$DB_NAME" > "$BACKUP_FILE"; then
  FILESIZE=$(du -h "$BACKUP_FILE" | cut -f1)
  echo "Backup completed successfully!"
  echo "  File: $BACKUP_FILE"
  echo "  Size: $FILESIZE"
else
  echo "Error: Backup failed" >&2
  rm -f "$BACKUP_FILE"
  exit 1
fi
