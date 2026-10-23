#!/usr/bin/env bash
set -euo pipefail

# Default Configuration
DEFAULT_CONTAINER="postgres16-postgis"
DEFAULT_DB_NAME="postgres"
DEFAULT_DB_USER="postgres"
DEFAULT_BACKUP_DIR="./pg_backups"

# Initialize with defaults
CONTAINER="$DEFAULT_CONTAINER"
DB_NAME="$DEFAULT_DB_NAME"
DB_USER="$DEFAULT_DB_USER"
BACKUP_DIR="$DEFAULT_BACKUP_DIR"
BACKUP_FILE=""

usage() {
  cat <<EOF
Usage: $(basename "$0") [OPTIONS]

Restore a PostgreSQL database from a backup file using pg_restore via Docker.

Options:
  -c CONTAINER   Docker container name (default: $DEFAULT_CONTAINER)
  -d DATABASE    Database name (default: $DEFAULT_DB_NAME)
  -u USER        Database user (default: $DEFAULT_DB_USER)
  -b BACKUP_DIR  Backup directory to search for latest backup (default: $DEFAULT_BACKUP_DIR)
  -f FILE        Specific backup file to restore (overrides -b)
  -h             Show this help message

If no backup file is specified with -f, the script will use the most recent
.dump file found in the backup directory.

Examples:
  $(basename "$0")                                    # Use latest backup from default directory
  $(basename "$0") -f ./pg_backups/mybackup.dump     # Restore specific file
  $(basename "$0") -c my_postgres -d mydb            # Custom container and database
  $(basename "$0") -b /backups                        # Use latest backup from custom directory
EOF
  exit 0
}

# Parse command-line options
while getopts "c:d:u:b:f:h" opt; do
  case $opt in
    c) CONTAINER="$OPTARG" ;;
    d) DB_NAME="$OPTARG" ;;
    u) DB_USER="$OPTARG" ;;
    b) BACKUP_DIR="$OPTARG" ;;
    f) BACKUP_FILE="$OPTARG" ;;
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

# If backup file is not specified, use the latest backup from the folder
if [ -z "$BACKUP_FILE" ]; then
  # Check if backup directory exists
  if [ ! -d "$BACKUP_DIR" ]; then
    echo "Error: Backup directory '$BACKUP_DIR' does not exist" >&2
    exit 1
  fi

  # Find the latest .dump file
  BACKUP_FILE=$(ls -1t "${BACKUP_DIR}"/*.dump 2>/dev/null | head -n1 || true)
  
  if [ -z "$BACKUP_FILE" ]; then
    echo "Error: No backup file (.dump) found in '$BACKUP_DIR'" >&2
    echo "You can specify a file directly with -f option" >&2
    exit 1
  fi
  
  echo "Using latest backup: $BACKUP_FILE"
fi

# Verify backup file exists and is readable
if [ ! -f "$BACKUP_FILE" ]; then
  echo "Error: Backup file '$BACKUP_FILE' does not exist" >&2
  exit 1
fi

if [ ! -r "$BACKUP_FILE" ]; then
  echo "Error: Backup file '$BACKUP_FILE' is not readable" >&2
  exit 1
fi

FILESIZE=$(du -h "$BACKUP_FILE" | cut -f1)

echo "Starting restore..."
echo "  Container: $CONTAINER"
echo "  Database:  $DB_NAME"
echo "  User:      $DB_USER"
echo "  File:      $BACKUP_FILE"
echo "  Size:      $FILESIZE"
echo ""

# Confirmation prompt
read -r -p "Are you sure you want to restore? This may overwrite existing data. [y/N] " response
if [[ ! "$response" =~ ^[Yy]$ ]]; then
  echo "Restore cancelled."
  exit 0
fi

if docker exec -i "$CONTAINER" pg_restore -U "$DB_USER" -d "$DB_NAME" -a --disable-triggers -v < "$BACKUP_FILE"; then
  echo ""
  echo "Restore completed successfully!"
else
  echo ""
  echo "Error: Restore failed or completed with warnings" >&2
  exit 1
fi
