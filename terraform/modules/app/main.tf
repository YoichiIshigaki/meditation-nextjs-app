# 必要な GCP API を有効化
locals {
  required_apis = [
    "artifactregistry.googleapis.com",
    "run.googleapis.com",
    "secretmanager.googleapis.com",
    "iam.googleapis.com",
  ]
}

resource "google_project_service" "apis" {
  for_each           = toset(local.required_apis)
  service            = each.value
  disable_on_destroy = false
}

# Artifact Registry (環境共通の1リポジトリ、イメージタグで環境を区別)
resource "google_artifact_registry_repository" "medimate" {
  repository_id = "medimate"
  format        = "DOCKER"
  location      = var.region
  description   = "MediMate app Docker images"

  depends_on = [google_project_service.apis]
}

# Secret Manager
resource "google_secret_manager_secret" "firebase_admin" {
  secret_id = "firebase-admin-credentials-${var.environment}"

  replication {
    auto {}
  }

  depends_on = [google_project_service.apis]
}

resource "google_secret_manager_secret" "firebase_client" {
  secret_id = "firebase-client-credentials-${var.environment}"

  replication {
    auto {}
  }

  depends_on = [google_project_service.apis]
}

# GitHub Actions 用サービスアカウント (環境ごとに分離)
resource "google_service_account" "github_actions" {
  account_id   = "github-actions-sa-${var.environment}"
  display_name = "GitHub Actions SA (${var.environment})"
}

resource "google_project_iam_member" "github_actions_ar" {
  project = var.project_id
  role    = "roles/artifactregistry.writer"
  member  = "serviceAccount:${google_service_account.github_actions.email}"
}

resource "google_project_iam_member" "github_actions_run" {
  project = var.project_id
  role    = "roles/run.admin"
  member  = "serviceAccount:${google_service_account.github_actions.email}"
}

resource "google_project_iam_member" "github_actions_sa_user" {
  project = var.project_id
  role    = "roles/iam.serviceAccountUser"
  member  = "serviceAccount:${google_service_account.github_actions.email}"
}

resource "google_secret_manager_secret_iam_member" "firebase_admin_access" {
  secret_id = google_secret_manager_secret.firebase_admin.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.github_actions.email}"
}

resource "google_secret_manager_secret_iam_member" "firebase_client_access" {
  secret_id = google_secret_manager_secret.firebase_client.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.github_actions.email}"
}
