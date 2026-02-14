terraform {
  required_version = ">= 1.5"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }

  # GCS バックエンドで state を管理 (バケットを手動で先に作成してから有効化)
  # gcloud storage buckets create gs://YOUR_PROJECT_ID-tfstate --location=asia-northeast1
  # backend "gcs" {
  #   bucket = "YOUR_PROJECT_ID-tfstate"
  #   prefix = "medimate"
  # }
}

provider "google" {
  project = var.project_id
  region  = var.region
}
