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
  for_each = toset(local.required_apis)
  service  = each.value

  disable_on_destroy = false
}
