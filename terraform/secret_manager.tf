# シークレットの定義のみ作成 (値は手動で登録)
# gcloud secrets versions add firebase-admin-credentials --data-file=./firebase-admin.json

resource "google_secret_manager_secret" "firebase_admin" {
  secret_id = "firebase-admin-credentials"

  replication {
    auto {}
  }

  depends_on = [google_project_service.apis]
}

resource "google_secret_manager_secret" "firebase_client" {
  secret_id = "firebase-client-credentials"

  replication {
    auto {}
  }

  depends_on = [google_project_service.apis]
}
