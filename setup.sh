#!/bin/bash
set -e

echo "=========================================="
echo " Starting ArtPark Dharini Server Setup"
echo "=========================================="

# ---------------------------------------------------------
# [1/4] Installing Docker and Docker Compose
# ---------------------------------------------------------
echo "[1/4] Installing Docker and Docker Compose..."
if ! command -v docker &> /dev/null
then
    sudo apt-get update
    sudo apt-get install -y ca-certificates curl gnupg lsb-release git

    # Add Docker's official GPG key
    sudo mkdir -p /etc/apt/keyrings
    if [ ! -f /etc/apt/keyrings/docker.gpg ]; then
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg --batch --yes || true
        sudo chmod a+r /etc/apt/keyrings/docker.gpg
    fi

    # Set up the stable repository
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

    # Ensure docker group exists and user is added
    sudo groupadd docker || true
    sudo usermod -aG docker $USER
    
    echo "Docker installed successfully!"
else
    echo "Docker is already installed."
fi

# Ensure docker daemon is running in WSL
if ! docker info &> /dev/null; then
    echo "Starting docker service..."
    sudo service docker start || true
    sleep 3
fi

# Determine DOCKER_CMD once for the entire script
if ! docker ps &> /dev/null; then
    DOCKER_CMD="sudo docker"
else
    DOCKER_CMD="docker"
fi

# ---------------------------------------------------------
# [2/4] Setting up Environment Variables
# ---------------------------------------------------------
echo "[2/4] Setting up Environment Variables..."

create_env() {
    if [ ! -f "$1" ]; then
        if [ -f "$1.example" ]; then
            cp "$1.example" "$1"
            echo "Created $1 from $1.example"
        else
            touch "$1"
            echo "Created empty $1 - PLEASE CONFIGURE IT LATER"
        fi
    else
        echo "$1 already exists, skipping."
    fi
}

# Only the root .env is needed for Docker deployment
create_env ".env"

# ---------------------------------------------------------
# [3/4] Initializing Garage S3 Storage Engine
# ---------------------------------------------------------
echo "[3/4] Initializing Garage S3 Storage Engine..."

# Generate garage.toml secrets if they are still placeholders
if grep -q "REPLACE_WITH_RPC_SECRET" garage.toml; then
    echo "Generating Garage RPC secret..."
    RPC_SECRET=$(openssl rand -hex 32)
    sed -i "s|REPLACE_WITH_RPC_SECRET|${RPC_SECRET}|g" garage.toml
fi
if grep -q "REPLACE_WITH_ADMIN_TOKEN" garage.toml; then
    echo "Generating Garage admin token..."
    ADMIN_TOKEN=$(openssl rand -hex 32)
    sed -i "s|REPLACE_WITH_ADMIN_TOKEN|${ADMIN_TOKEN}|g" garage.toml
fi
echo "garage.toml secrets are configured."


$DOCKER_CMD compose --profile production up -d garage
echo "Waiting for Garage to start..."
sleep 8 # Increased wait time for slow systems

echo "Configuring Garage local node..."
NODE_ID=$($DOCKER_CMD exec garage /garage node id | cut -d'@' -f1)
echo "Node ID: $NODE_ID"

$DOCKER_CMD exec garage /garage layout assign $NODE_ID --zone local-dc --capacity 100G || true
$DOCKER_CMD exec garage /garage layout apply --version 1 || true

echo "Creating 'dharini-bucket' in Garage..."
$DOCKER_CMD exec garage /garage bucket create dharini-bucket || true

# ---------------------------------------------------------
# [4/4] Updating Environment Variables with Garage Keys
# ---------------------------------------------------------
echo "[4/4] Updating Environment Variables with Garage Credentials..."

# Helper to update .env
update_env_var() {
    local key=$1
    local value=$2
    if grep -q "^${key}=" .env; then
        sed "s|^${key}=.*|${key}=${value}|" .env > .env.tmp && mv .env.tmp .env
    else
        echo "${key}=${value}" >> .env
    fi
}

echo "Checking existing S3 credentials in .env..."

EXISTING_ACCESS_KEY=$(grep "^S3_ACCESSKEYID=" .env | cut -d '=' -f2)
EXISTING_SECRET_KEY=$(grep "^S3_SECRETACCESSKEY=" .env | cut -d '=' -f2)

if [ -n "$EXISTING_ACCESS_KEY" ] && [ -n "$EXISTING_SECRET_KEY" ]; then
    echo "Using existing credentials from .env"

    ACCESS_KEY=$EXISTING_ACCESS_KEY
    SECRET_KEY=$EXISTING_SECRET_KEY

else
    echo "No valid credentials found. Creating new Garage key..."

    KEY_OUTPUT=$($DOCKER_CMD exec garage /garage key create dharini-key)

    echo "$KEY_OUTPUT"

    ACCESS_KEY=$(echo "$KEY_OUTPUT" | grep "Key ID" | awk '{print $3}')
    SECRET_KEY=$(echo "$KEY_OUTPUT" | grep "Secret key" | awk '{print $3}')

    if [ -z "$ACCESS_KEY" ] || [ -z "$SECRET_KEY" ]; then
        echo "ERROR: Failed to extract Garage keys during creation"
        exit 1
    fi

    echo "Saving credentials to .env..."

    update_env_var "S3_ACCESSKEYID" "$ACCESS_KEY"
    update_env_var "S3_SECRETACCESSKEY" "$SECRET_KEY"
fi

# Always ensure bucket permission
$DOCKER_CMD exec garage /garage bucket allow --read --write --owner dharini-bucket --key dharini-key

# Set remaining config
update_env_var "S3_REGION" "us-east-1"
update_env_var "S3_ENDPOINT" "http://garage:3900"
update_env_var "S3_BUCKET" "dharini-bucket"

echo "Garage credentials configured successfully!"

mkdir -p ~/.aws

cat > ~/.aws/config <<EOF
[default]
region = us-east-1
s3 =
    addressing_style = path
    signature_version = s3v4
EOF

echo "================================================================"
echo " Setup Successfully Finished! "
echo "================================================================"
echo " All services are configured and the .env file is updated."
echo " You can now run ./deploy.sh production to pull the images and start the application."
echo "================================================================"
