terraform {
  required_version = ">= 1.5"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }

  backend "gcs" {}
}

provider "google" {
  project = var.project_id
  region  = var.region
}

module "app" {
  source      = "../../modules/app"
  project_id  = var.project_id
  region      = var.region
  environment = var.environment
}
