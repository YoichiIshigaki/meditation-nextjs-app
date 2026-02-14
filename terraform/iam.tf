# GitHub Actions 用サービスアカウント
resource "google_service_account" "github_actions" {
  account_id   = "github-actions-sa"
  display_name = "GitHub Actions Service Account"
}

# Artifact Registry 書き込み権限
resource "google_project_iam_member" "github_actions_ar" {
  project = var.project_id
  role    = "roles/artifactregistry.writer"
  member  = "serviceAccount:${google_service_account.github_actions.email}"
}

# Cloud Run デプロイ権限
resource "google_project_iam_member" "github_actions_run" {
  project = var.project_id
  role    = "roles/run.admin"
  member  = "serviceAccount:${google_service_account.github_actions.email}"
}

# Cloud Run が SA を使用するために必要
resource "google_project_iam_member" "github_actions_sa_user" {
  project = var.project_id
  role    = "roles/iam.serviceAccountUser"
  member  = "serviceAccount:${google_service_account.github_actions.email}"
}

# firebase-admin-credentials へのアクセス権限
resource "google_secret_manager_secret_iam_member" "firebase_admin_access" {
  secret_id = google_secret_manager_secret.firebase_admin.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.github_actions.email}"
}

# firebase-client-credentials へのアクセス権限
resource "google_secret_manager_secret_iam_member" "firebase_client_access" {
  secret_id = google_secret_manager_secret.firebase_client.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.github_actions.email}"
}
