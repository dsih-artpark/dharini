#!/usr/bin/env bash
set -euo pipefail

# Default Configuration
DEFAULT_CONTAINER="postgres16-postgis"
DEFAULT_DB_NAME="postgres"
DEFAULT_DB_USER="postgres"
DEFAULT_DB_SCHEMA="public"
# Admin details come from the same variables the backend seeder reads, so
# `set -a; . ./.env; set +a` before running picks them up. Email is required.
DEFAULT_ADMIN_EMAIL="${SUPER_ADMIN_EMAIL:-}"
DEFAULT_ADMIN_FIRSTNAME="${SUPER_ADMIN_FIRST_NAME:-Super}"
DEFAULT_ADMIN_LASTNAME="${SUPER_ADMIN_LAST_NAME:-Admin}"
DEFAULT_ADMIN_PHONE="${SUPER_ADMIN_PHONE:-}"

# Initialize with defaults
CONTAINER="$DEFAULT_CONTAINER"
DB_NAME="$DEFAULT_DB_NAME"
DB_USER="$DEFAULT_DB_USER"
DB_SCHEMA="$DEFAULT_DB_SCHEMA"
ADMIN_EMAIL="$DEFAULT_ADMIN_EMAIL"
ADMIN_FIRSTNAME="$DEFAULT_ADMIN_FIRSTNAME"
ADMIN_LASTNAME="$DEFAULT_ADMIN_LASTNAME"
ADMIN_PHONE="$DEFAULT_ADMIN_PHONE"
SKIP_CONFIRM=false

usage() {
  cat <<EOF
Usage: $(basename "$0") [OPTIONS]

Wipe all data from a PostgreSQL database schema and insert a super admin user.

WARNING: This will permanently delete all data in the specified schema!

Options:
  -c CONTAINER   Docker container name (default: $DEFAULT_CONTAINER)
  -d DATABASE    Database name (default: $DEFAULT_DB_NAME)
  -u USER        Database user (default: $DEFAULT_DB_USER)
  -s SCHEMA      Database schema to wipe (default: $DEFAULT_DB_SCHEMA)
  -e EMAIL       Super admin email (required; default: \$SUPER_ADMIN_EMAIL)
  -n FIRSTNAME   Super admin first name (default: \$SUPER_ADMIN_FIRST_NAME or Super)
  -l LASTNAME    Super admin last name (default: \$SUPER_ADMIN_LAST_NAME or Admin)
  -p PHONE       Super admin phone number (default: \$SUPER_ADMIN_PHONE or none)
  -y             Skip confirmation prompt (use with caution!)
  -h             Show this help message

Examples:
  $(basename "$0") -e admin@example.org                 # Confirm before wiping
  $(basename "$0") -e admin@example.org -y              # Skip confirmation (dangerous!)
  $(basename "$0") -e admin@example.org -c my_postgres -d mydb  # Custom container and database
EOF
  exit 0
}

# Parse command-line options
while getopts "c:d:u:s:e:n:l:p:yh" opt; do
  case $opt in
    c) CONTAINER="$OPTARG" ;;
    d) DB_NAME="$OPTARG" ;;
    u) DB_USER="$OPTARG" ;;
    s) DB_SCHEMA="$OPTARG" ;;
    e) ADMIN_EMAIL="$OPTARG" ;;
    n) ADMIN_FIRSTNAME="$OPTARG" ;;
    l) ADMIN_LASTNAME="$OPTARG" ;;
    p) ADMIN_PHONE="$OPTARG" ;;
    y) SKIP_CONFIRM=true ;;
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

if [ -z "$ADMIN_EMAIL" ]; then
  echo "Error: no super admin email. Pass -e EMAIL or set SUPER_ADMIN_EMAIL." >&2
  echo "Use -h for help" >&2
  exit 1
fi

# contactNumber is unique, so store a missing phone as NULL, not ''
if [ -n "$ADMIN_PHONE" ]; then
  ADMIN_PHONE_SQL="'${ADMIN_PHONE}'"
else
  ADMIN_PHONE_SQL="NULL"
fi

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

echo "=== DATABASE WIPE OPERATION ==="
echo ""
echo "This will PERMANENTLY DELETE all data in:"
echo "  Container: $CONTAINER"
echo "  Database:  $DB_NAME"
echo "  Schema:    $DB_SCHEMA"
echo ""
echo "A new super admin will be created:"
echo "  Email:     $ADMIN_EMAIL"
echo "  Name:      $ADMIN_FIRSTNAME $ADMIN_LASTNAME"
echo "  Phone:     $ADMIN_PHONE"
echo ""

# Confirmation prompt
if [ "$SKIP_CONFIRM" = false ]; then
  read -r -p "Are you absolutely sure you want to wipe all data? Type 'yes' to confirm: " response
  if [ "$response" != "yes" ]; then
    echo "Wipe cancelled."
    exit 0
  fi
fi

echo "Wiping data for database '$DB_NAME', schema '$DB_SCHEMA'..."

# Get list of tables
TABLES_SQL="SELECT quote_ident(tablename) FROM pg_tables WHERE schemaname = '$DB_SCHEMA';"

TABLES=$(docker exec -i "$CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -At -c "$TABLES_SQL")

if [ -z "$TABLES" ]; then
  echo "Warning: No tables found in schema '$DB_SCHEMA'" >&2
  echo "Nothing to truncate."
else
  IFS=$'\n' read -r -d '' -a arr <<< "$TABLES" || true
  TARGETS=""
  for t in "${arr[@]}"; do
    [ -z "$t" ] && continue
    if [ -z "$TARGETS" ]; then
      TARGETS="${DB_SCHEMA}.$t"
    else
      TARGETS="${TARGETS}, ${DB_SCHEMA}.$t"
    fi
  done

  if [ -n "$TARGETS" ]; then
    TRUNCATE_SQL="BEGIN;
SET session_replication_role = replica;
TRUNCATE TABLE $TARGETS RESTART IDENTITY CASCADE;
SET session_replication_role = DEFAULT;
COMMIT;"

    if docker exec -i "$CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -c "$TRUNCATE_SQL"; then
      echo "Truncated all tables in schema '$DB_SCHEMA'"
    else
      echo "Error: Failed to truncate tables" >&2
      exit 1
    fi
  fi
fi

# Insert super admin - using parameterized values
INSERT_SQL="INSERT INTO ${DB_SCHEMA}.users (
  \"firstName\",
  \"lastName\",
  \"profilePicture\",
  designation,
  \"contactNumber\",
  address,
  email,
  status,
  \"projectId\",
  \"teamId\"
)
VALUES (
  '${ADMIN_FIRSTNAME}',
  '${ADMIN_LASTNAME}',
  NULL,
  'super-admin',
  ${ADMIN_PHONE_SQL},
  NULL,
  '${ADMIN_EMAIL}',
  'active',
  NULL,
  NULL
);"

if docker exec -i "$CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -c "$INSERT_SQL"; then
  echo "Inserted super admin"
else
  echo "Error: Failed to insert super admin" >&2
  exit 1
fi

echo ""
echo "=== Wipe complete & super admin inserted! ==="
