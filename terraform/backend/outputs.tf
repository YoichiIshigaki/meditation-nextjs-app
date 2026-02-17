output "tfstate_bucket_name" {
  description = "Terraform state 管理用 GCS バケット名"
  value       = google_storage_bucket.tfstate.name
}
