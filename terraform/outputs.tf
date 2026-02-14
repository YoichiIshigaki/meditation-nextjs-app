output "artifact_registry_url" {
  description = "Artifact Registry の URL (IMAGE_REGISTRY に設定する値)"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.medimate.repository_id}"
}

output "github_actions_sa_email" {
  description = "GitHub Actions SA のメールアドレス"
  value       = google_service_account.github_actions.email
}

output "firebase_admin_secret_name" {
  description = "Firebase Admin シークレット名"
  value       = google_secret_manager_secret.firebase_admin.secret_id
}

output "firebase_client_secret_name" {
  description = "Firebase Client シークレット名"
  value       = google_secret_manager_secret.firebase_client.secret_id
}
