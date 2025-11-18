#!/bin/bash

# --- Best Practice: Exit immediately if a command exits with a non-zero status.
set -e

# --- Configuration
# It's much safer to load secrets from environment variables than to hardcode them.
# Before running this script, export your token: export DOCKER_HUB_TOKEN="your_token_here"
AppVersion="prod-1.0.2"
DockerHubUser="smfkarimbdcalling"
DockerHubUserToken="dckr_pat_8DrK2wL7K0C8PRGsZ0NmcPhwWD8" # Reads the token from an environment variable
DockerHubRepoName="bag-voting-front-election"
DockerHubRepository="${DockerHubUser}/${DockerHubRepoName}"

# --- Service Specifics
ServiceName="frontend-service"
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
# BackendServiceDir= "source_directory"
FullImageName="${DockerHubRepository}:${ServiceName}-${AppVersion}"

# --- Script Logic

# 1. Authenticate with Docker Hub
echo "Logging in to Docker Hub..."
if [ -z "$DockerHubUserToken" ]; then
    echo "Error: DOCKER_HUB_TOKEN environment variable is not set."
    exit 1
fi
echo "$DockerHubUserToken" | docker login --username "$DockerHubUser" --password-stdin

# 2. Build the Docker Image
echo "Building image for ${ServiceName}..."
# docker image build --no-cache -f "Dockerfile" -t "${ServiceName}:${AppVersion}" "./${BackendServiceDir}/"
docker image build --no-cache -f "Dockerfile" -t "${ServiceName}:${AppVersion}" "./"

# 3. Tag the Image for Docker Hub
echo "Tagging image as ${FullImageName}..."
docker image tag "${ServiceName}:${AppVersion}" "${FullImageName}"

# 4. Push the Image to Docker Hub
echo "Pushing image to Docker Hub..."
docker push "${FullImageName}"

echo "✅ Script completed successfully!"

### End-Of-File ###
