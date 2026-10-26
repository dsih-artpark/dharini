#!/bin/bash
set -euo pipefail

echo "======================================"
echo "🔐 Keystore Setup Script"
echo "======================================"

# ----------------------------
# CONFIG (you can override via env)
# ----------------------------
MOBILE_DIR="./mobile"
KEYSTORE_DIR="$MOBILE_DIR/android/app"
KEYSTORE_FILE="release-keystore.jks"
KEYSTORE_PATH="$KEYSTORE_DIR/$KEYSTORE_FILE"

KEY_ALIAS="${KEY_ALIAS:-dharini-key}"
# Random passwords unless you pass your own. They are written to mobile/.env and
# mobile/android/key.properties (both git-ignored); keep a copy somewhere safe.
KEY_PASSWORD="${KEY_PASSWORD:-$(openssl rand -hex 16)}"
STORE_PASSWORD="${STORE_PASSWORD:-$(openssl rand -hex 16)}"
VALIDITY_DAYS="${VALIDITY_DAYS:-10000}"

ENV_FILE="$MOBILE_DIR/.env"
KEY_PROPERTIES_FILE="$MOBILE_DIR/android/key.properties"

# ----------------------------
# SAFETY CHECKS
# ----------------------------
mkdir -p "$KEYSTORE_DIR"

echo ""
echo "👉 Checking existing keystore..."

if [ -f "$KEYSTORE_PATH" ]; then
  echo "⚠️ Keystore already exists at $KEYSTORE_PATH"
  echo "👉 Skipping generation (use FORCE=true to regenerate)"
  if [ "${FORCE:-false}" != "true" ]; then
    exit 0
  fi
fi

# ----------------------------
# GENERATE KEYSTORE
# ----------------------------
echo ""
echo "👉 Generating new keystore..."

keytool -genkeypair \
  -v \
  -keystore "$KEYSTORE_PATH" \
  -alias "$KEY_ALIAS" \
  -keyalg RSA \
  -keysize 2048 \
  -validity "$VALIDITY_DAYS" \
  -storepass "$STORE_PASSWORD" \
  -keypass "$KEY_PASSWORD" \
  -dname "CN=Android, OU=Dev, O=Company, L=City, S=State, C=IN"

echo "✅ Keystore created at: $KEYSTORE_PATH"

# ----------------------------
# UPDATE .env FILE
# ----------------------------
echo ""
echo "👉 Updating .env file..."

touch "$ENV_FILE"

update_env() {
  KEY=$1
  VALUE=$2

  if grep -q "^$KEY=" "$ENV_FILE"; then
    sed -i "s|^$KEY=.*|$KEY=$VALUE|g" "$ENV_FILE"
  else
    echo "$KEY=$VALUE" >> "$ENV_FILE"
  fi
}

update_env "ANDROID_KEYSTORE_PATH" "android/app/$KEYSTORE_FILE"
update_env "ANDROID_KEY_ALIAS" "$KEY_ALIAS"
update_env "ANDROID_STORE_PASSWORD" "$STORE_PASSWORD"
update_env "ANDROID_KEY_PASSWORD" "$KEY_PASSWORD"

echo "✅ .env updated"

# ----------------------------
# CREATE key.properties
# ----------------------------
echo ""
echo "👉 Creating key.properties..."

cat > "$KEY_PROPERTIES_FILE" <<EOF
storeFile=release-keystore.jks
storePassword=$STORE_PASSWORD
keyAlias=$KEY_ALIAS
keyPassword=$KEY_PASSWORD
EOF

echo "✅ key.properties created"

# ----------------------------
# FINAL OUTPUT
# ----------------------------
echo ""
echo "======================================"
echo "🎉 Keystore setup completed"
echo "======================================"
echo "Keystore: $KEYSTORE_PATH"
echo ".env updated: $ENV_FILE"
echo "key.properties: $KEY_PROPERTIES_FILE"
echo "======================================"
