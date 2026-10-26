#!/bin/bash

set -euo pipefail

# ---------------------------------------------------------
# CONFIG
# ---------------------------------------------------------
BASE_DIR=$(pwd)
MOBILE_DIR="$BASE_DIR/mobile"

# ---------------------------------------------------------
# LOAD ENVIRONMENT (must come before any command checks)
# ---------------------------------------------------------
# Source bashrc so that pub-cache/bin et al. are on PATH
if [ -f "$HOME/.bashrc" ]; then
  set +u
  source "$HOME/.bashrc"
  set -u
fi

export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PUB_CACHE="$HOME/.pub-cache"
export ANDROID_HOME=/opt/android-sdk
export ANDROID_SDK_ROOT=/opt/android-sdk
export PATH="$JAVA_HOME/bin:$HOME/development/flutter/bin:$PUB_CACHE/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"

# ---------------------------------------------------------
# LOGGING HELPERS
# ---------------------------------------------------------
log() {
  echo -e "\n👉 $1"
}

error() {
  echo -e "\n❌ $1"
  exit 1
}

# ---------------------------------------------------------
# PRECHECKS
# ---------------------------------------------------------
log "Validating environment..."

[ -d "$MOBILE_DIR" ] || error "'mobile' directory not found"

command -v fvm >/dev/null || error "fvm not installed"
command -v melos >/dev/null || error "melos not installed"
command -v java >/dev/null || error "Java not installed"

[ -f "$HOME/.pub-cache/bin/fvm" ] || error "FVM binary missing"

# ---------------------------------------------------------
# ENV (already set above, kept as no-op for reference)
# ---------------------------------------------------------

# ---------------------------------------------------------
# ENTER PROJECT
# ---------------------------------------------------------
log "Mobile directory: $MOBILE_DIR"
cd "$MOBILE_DIR"

# Create FVM symlink so melos resolves flutter SDK (mirrors mobile-ci.yml)
log "Creating FVM symlink for melos..."
mkdir -p .fvm
ln -sfn "$(dirname "$(dirname "$(which flutter)")")" .fvm/flutter_sdk

# ---------------------------------------------------------
# FLUTTER CHECK
# ---------------------------------------------------------
log "Checking Flutter setup..."
fvm flutter doctor || error "Flutter doctor failed"

# ---------------------------------------------------------
# ENV CHECK
# ---------------------------------------------------------
[ -f ".env" ] || error ".env file missing — create mobile/.env with the required keys"
[ -f "android/app/release-keystore.jks" ] || error "release-keystore.jks not found at android/app/. Copy the keystore file before building."

# ---------------------------------------------------------
# CLEAN (optional but recommended)
# ---------------------------------------------------------
if [ "${CLEAN_BUILD:-false}" = "true" ]; then
  log "Cleaning previous builds..."
  fvm flutter clean
fi

# ---------------------------------------------------------
# BOOTSTRAP
# ---------------------------------------------------------
log "Bootstrapping workspace..."
fvm dart run melos bootstrap

log "Fetching dependencies..."
fvm flutter pub get

# ---------------------------------------------------------
# CODE GENERATION
# ---------------------------------------------------------
log "Generating code..."
fvm dart run melos run schema:generate
fvm dart run melos run barrel:generate

# ---------------------------------------------------------
# BUILD
# ---------------------------------------------------------
log "Building APK..."
START_TIME=$(date +%s)

export GRADLE_OPTS="-Dorg.gradle.daemon=false -Xmx2G"
fvm flutter build apk --release || error "Build failed"
log "Building Web App..."
fvm flutter build web --release || error "Web build failed"

END_TIME=$(date +%s)
log "Builds completed in $((END_TIME - START_TIME)) seconds"

# ---------------------------------------------------------
# VERIFY APK
# ---------------------------------------------------------
SOURCE_APK="build/app/outputs/flutter-apk/app-release.apk"
[ -f "$SOURCE_APK" ] || error "APK not found"

# ---------------------------------------------------------
# VERSIONING
# ---------------------------------------------------------
RAW_VERSION=$(grep '^version:' pubspec.yaml | awk '{print $2}')
CLEAN_VERSION=${RAW_VERSION%%+*}
COMMIT_HASH=$(git rev-parse --short HEAD || echo "unknown")

log "Version: $RAW_VERSION"

# ---------------------------------------------------------
# NAME THE APK
# ---------------------------------------------------------
APK_FILENAME="dharini-v${CLEAN_VERSION}.apk"
OUTPUT_APK="build/app/outputs/flutter-apk/$APK_FILENAME"
cp "$SOURCE_APK" "$OUTPUT_APK"

# ---------------------------------------------------------
# REFRESH MOBILE WEB
# ---------------------------------------------------------
# The mobile-web container serves ./mobile-web with nginx, so copying the files
# is enough. Empty the folder instead of deleting it so the mount stays valid.
log "Refreshing Mobile Web..."
cd "$BASE_DIR"
mkdir -p mobile-web
find mobile-web -mindepth 1 -delete
cp -r "$MOBILE_DIR/build/web/." mobile-web/
if docker compose version >/dev/null 2>&1; then
  sudo docker compose --profile mobile-web up -d mobile-web
fi

# ---------------------------------------------------------
# DONE
# ---------------------------------------------------------
echo ""
echo "=========================================="
echo " ✅ BUILD SUCCESSFUL"
echo " 📱 APK: $MOBILE_DIR/$OUTPUT_APK"
echo " 🔢 Version: $RAW_VERSION"
echo " 🧾 Commit: $COMMIT_HASH"
echo "=========================================="
