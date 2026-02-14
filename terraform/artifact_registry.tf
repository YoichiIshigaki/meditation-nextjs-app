resource "google_artifact_registry_repository" "medimate" {
  repository_id = "medimate"
  format        = "DOCKER"
  location      = var.region
  description   = "MediMate app Docker images"

  depends_on = [google_project_service.apis]
}
