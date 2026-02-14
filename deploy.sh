#!/bin/bash
set -e

# ---- 設定 ----
PROJECT_ID="${GCP_PROJECT_ID:-vue3-tutorial-127e1}"
REGION="asia-northeast1"
IMAGE_REGISTRY="$REGION-docker.pkg.dev/$PROJECT_ID/medimate"
IMAGE_NAME="medimate-app"
ENVIRONMENT="${1:-development}"  # 引数で指定可能 (development / staging / production)
SERVICE_NAME="medimate-app-$ENVIRONMENT"
IMAGE_TAG="$IMAGE_REGISTRY/$IMAGE_NAME:$(git rev-parse --short HEAD)"

echo "==== MediMate Cloud Run Deploy ===="
echo "Environment : $ENVIRONMENT"
echo "Service     : $SERVICE_NAME"
echo "Image       : $IMAGE_TAG"
echo "Region      : $REGION"
echo ""

# ---- Docker build & push ----
echo ">>> Building Docker image..."
docker build --tag "$IMAGE_TAG" .

echo ">>> Pushing image to Artifact Registry..."
gcloud auth configure-docker "$REGION-docker.pkg.dev" --quiet
docker push "$IMAGE_TAG"

# ---- Cloud Run deploy ----
echo ">>> Deploying to Cloud Run..."
gcloud run deploy "$SERVICE_NAME" \
  --image "$IMAGE_TAG" \
  --region "$REGION" \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --memory 256Mi \
  --cpu 1 \
  --min-instances 1 \
  --max-instances 3 \
  --set-secrets "FIREBASE_ADMIN_CREDENTIALS=firebase-admin-credentials:latest" \
  --set-secrets "FIREBASE_CLIENT_CREDENTIALS=firebase-client-credentials:latest" \
  --quiet

URL=$(gcloud run services describe "$SERVICE_NAME" \
  --region "$REGION" \
  --format 'value(status.url)')

echo ""
echo "==== Deploy complete ===="
echo "URL: $URL"
