#!/bin/bash
set -euo pipefail

echo "=========================================="
echo " Mobile Setup (Full + Idempotent)"
echo "=========================================="

log() { echo -e "\n👉 $1"; }
error() { echo -e "\n❌ $1"; exit 1; }

# Load user bashrc if available
if [ -f "$HOME/.bashrc" ]; then
  set +u
  source "$HOME/.bashrc"
  set -u
fi

# ---------------------------------------------------------
# [1] SYSTEM DEPENDENCIES
# ---------------------------------------------------------
log "Checking system dependencies..."

sudo apt-get update

sudo apt-get install -y \
  curl git unzip xz-utils zip libglu1-mesa jq wget \
  openjdk-17-jdk

# ---------------------------------------------------------
# [2] ENV SETUP (persistent + idempotent)
# ---------------------------------------------------------

log "Setting environment variables..."

ensure_line() {
  local line="$1"
  local file="$HOME/.bashrc"
  grep -qxF "$line" "$file" || echo "$line" >> "$file"
}

ensure_line 'export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64'
ensure_line 'export PUB_CACHE="$HOME/.pub-cache"'
ensure_line 'export ANDROID_HOME=/opt/android-sdk'
ensure_line 'export ANDROID_SDK_ROOT=/opt/android-sdk'
ensure_line 'export PATH="$JAVA_HOME/bin:$HOME/development/flutter/bin:$PUB_CACHE/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"'

# Apply immediately to current shell
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PUB_CACHE="$HOME/.pub-cache"
export ANDROID_HOME=/opt/android-sdk
export ANDROID_SDK_ROOT=/opt/android-sdk
export PATH="$JAVA_HOME/bin:$HOME/development/flutter/bin:$PUB_CACHE/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"

# ---------------------------------------------------------
# [3] FLUTTER (BASE)
# ---------------------------------------------------------
if ! command -v flutter >/dev/null; then
  log "Installing Flutter..."

  mkdir -p $HOME/development
  cd $HOME/development

  FLUTTER_VERSION="3.29.0"
  FLUTTER_ARCHIVE="flutter_linux_${FLUTTER_VERSION}-stable.tar.xz"
  curl -O "https://storage.googleapis.com/flutter_infra_release/releases/stable/linux/${FLUTTER_ARCHIVE}"
  tar xf "${FLUTTER_ARCHIVE}"
  rm "${FLUTTER_ARCHIVE}"

  cd - >/dev/null
else
  log "Flutter already installed"
fi

export PATH="$PATH:$HOME/development/flutter/bin"

log "Base Flutter (for FVM bootstrap):"
flutter --version || error "Flutter not working"

# ---------------------------------------------------------
# [4] ANDROID SDK
# ---------------------------------------------------------
log "Setting up Android SDK..."

if [ ! -f "$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager" ]; then
  log "Android cmdline-tools not found. Installing..."

  sudo mkdir -p $ANDROID_HOME
  sudo chown -R $USER:$USER $ANDROID_HOME

  TMP_DIR="$HOME/tmp-android-sdk"
  mkdir -p "$TMP_DIR"
  cd "$TMP_DIR"

  wget https://dl.google.com/android/repository/commandlinetools-linux-13114758_latest.zip
  unzip -o commandlinetools-linux-*.zip

  # Clean old install if exists (important for idempotency)
  rm -rf $ANDROID_HOME/cmdline-tools/latest

  mkdir -p $ANDROID_HOME/cmdline-tools
  mv cmdline-tools $ANDROID_HOME/cmdline-tools/latest

  rm commandlinetools-linux-*.zip
  rm -rf "$TMP_DIR"

  cd - >/dev/null
else
  log "Android cmdline-tools already installed"
fi

# Ensure sdkmanager works
SDKMANAGER="$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager"
[ -f "$SDKMANAGER" ] || error "Android sdkmanager not found at $SDKMANAGER"

log "Installing required SDK components..."

log "Validating Android SDK components..."

# Platform-tools
if [ ! -d "$ANDROID_HOME/platform-tools" ]; then
  log "Installing platform-tools..."
  $SDKMANAGER "platform-tools"
else
  log "platform-tools already installed"
fi

# Android Platform 34 (for core-for-system-modules)
if [ ! -d "$ANDROID_HOME/platforms/android-34" ]; then
  log "Installing android-34 platform..."
  $SDKMANAGER "platforms;android-34"
else
  log "android-34 already installed"
fi

# Android Platform 36 (compileSdk target in app/build.gradle)
if [ ! -d "$ANDROID_HOME/platforms/android-36" ]; then
  log "Installing android-36 platform..."
  $SDKMANAGER "platforms;android-36"
else
  log "android-36 already installed"
fi

# Build tools
if [ ! -d "$ANDROID_HOME/build-tools/34.0.0" ]; then
  log "Installing build-tools 34.0.0..."
  $SDKMANAGER "build-tools;34.0.0"
else
  log "build-tools already installed"
fi

# NDK (required by flutter_image_compress, geolocator, mobile_scanner)
if [ ! -d "$ANDROID_HOME/ndk/27.0.12077973" ]; then
  log "Installing NDK 27.0.12077973..."
  $SDKMANAGER "ndk;27.0.12077973"
else
  log "NDK already installed"
fi

if [ ! -f "$ANDROID_HOME/licenses/android-sdk-license" ]; then
  log "Accepting Android licenses..."
  yes | $SDKMANAGER --licenses >/dev/null 2>&1 || true
  log "Licenses accepted"
else
  log "Licenses already accepted"
fi

# ---------------------------------------------------------
# [5] DART (via Flutter)
# ---------------------------------------------------------
command -v dart >/dev/null || error "Dart not available"

# ---------------------------------------------------------
# [6] FVM + MELOS (per-user install)
# ---------------------------------------------------------
log "Checking FVM + Melos..."

# Ensure pub-cache is in PATH
export PATH="$HOME/.pub-cache/bin:$PATH"

if ! command -v fvm >/dev/null; then
  log "Installing FVM..."
  dart pub global activate fvm
else
  log "FVM already installed"
fi

if ! command -v melos >/dev/null; then
  log "Installing Melos..."
  dart pub global activate melos
else
  log "Melos already installed"
fi

# ---------------------------------------------------------
# [7] PROJECT SETUP
# ---------------------------------------------------------
[ -d "mobile" ] || error "'mobile' directory not found"

cd mobile

log "Installing Flutter version via FVM..."
fvm install
fvm use --force

# ---------------------------------------------------------
# [8] VALIDATION
# ---------------------------------------------------------
log "Running Flutter doctor..."
fvm flutter doctor || error "Flutter doctor failed"

echo ""
echo "=========================================="
echo " ✅ Setup Completed Successfully"
echo " Everything is installed and ready"
echo "=========================================="
