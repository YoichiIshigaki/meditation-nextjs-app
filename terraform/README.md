# Terraform セットアップガイド

## 前提条件

- [Homebrew](https://brew.sh/) がインストール済みであること
- [gcloud CLI](https://cloud.google.com/sdk/docs/install) がインストール済みであること
- GCP プロジェクトが作成済みであること
- GNU grep がインストール済みであること (tfenv の要件)

### GNU grep のインストール (macOS)

macOS の標準 grep は BSD 版のため、tfenv が動作しません。

```bash
brew install grep

# PATH に追加
echo 'export PATH="$(brew --prefix grep)/libexec/gnubin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# 確認
grep --version
# grep (GNU grep) x.x.x
```

---

## 1. tfenv のインストール

tfenv は Terraform のバージョンマネージャーです。

```bash
brew install tfenv
```

インストール確認：

```bash
tfenv --version
# tfenv 3.x.x
```

---

## 2. Terraform のインストール

```bash
# インストール可能なバージョン一覧を確認
tfenv list-remote

# バージョンを指定してインストール (1.5 系の最新を推奨)
tfenv install 1.9.0

# 使用するバージョンを設定
tfenv use 1.9.0
```

バージョン確認：

```bash
terraform --version
# Terraform v1.9.0
```

> `.terraform-version` ファイルをプロジェクトルートに置くと、そのディレクトリで自動的にバージョンが切り替わります。
>
> ```bash
> echo "1.9.0" > terraform/.terraform-version
> ```

---

## 3. gcloud 認証

Terraform が GCP を操作するための認証を行います。

```bash
# ブラウザ経由でログイン
gcloud auth login

# Application Default Credentials を設定 (Terraform が使用)
gcloud auth application-default login

# 操作対象のプロジェクトを設定
gcloud config set project YOUR_PROJECT_ID
```

---

## 4. 変数ファイルの作成

```bash
cd terraform

cp terraform.tfvars.example terraform.tfvars
```

`terraform.tfvars` を編集：

```hcl
project_id = "your-gcp-project-id"
region     = "asia-northeast1"
```

> `terraform.tfvars` は `.gitignore` で除外済みのため、コミットされません。

---

## 5. 初回セットアップ

### 5-1. 初期化

```bash
terraform init
```

### 5-2. 実行計画の確認

```bash
terraform plan
```

作成されるリソースが一覧表示されます。問題がなければ次のステップへ進みます。

### 5-3. 適用

```bash
terraform apply
```

`yes` と入力して確定します。

---

## 6. apply 後の手動作業

Terraform はシークレットの**定義**のみ作成します。**値**は手動で登録します。

### Firebase 認証情報を Secret Manager に登録

```bash
# Firebase Admin SDK の認証情報
gcloud secrets versions add firebase-admin-credentials \
  --data-file=./path/to/firebase-admin.json

# Firebase Client SDK の認証情報
gcloud secrets versions add firebase-client-credentials \
  --data-file=./path/to/firebase-client.json
```

### GitHub Actions 用のサービスアカウントキーを発行

```bash
# SA のメールアドレスを取得
SA_EMAIL=$(terraform output -raw github_actions_sa_email)

# キーを発行
gcloud iam service-accounts keys create sa-key.json \
  --iam-account="$SA_EMAIL"

echo "sa-key.json の中身を GitHub Secrets の GCP_SA_KEY に登録してください"
```

### GitHub Secrets に登録する値

| Secret 名 | 取得方法 |
|---|---|
| `GCP_PROJECT_ID` | `terraform.tfvars` の `project_id` |
| `GCP_SA_KEY` | `sa-key.json` の中身 (JSON全体) |
| `NEXTAUTH_URL` | Cloud Run デプロイ後の URL |
| `AUTH_NEXT` | 任意の文字列 (32文字以上推奨) |
| `RESEND_API_KEY` | Resend コンソールから取得 |
| `EMAIL_FROM` | 送信元メールアドレス |

---

## 7. GCS バックエンドへの移行 (推奨)

デフォルトでは state がローカルに保存されます。チーム開発では GCS に保存することを推奨します。

### バケットを作成

```bash
gcloud storage buckets create gs://YOUR_PROJECT_ID-tfstate \
  --location=asia-northeast1 \
  --uniform-bucket-level-access
```

### backend を有効化

`main.tf` のコメントアウトを解除：

```hcl
backend "gcs" {
  bucket = "YOUR_PROJECT_ID-tfstate"
  prefix = "medimate"
}
```

### state を移行

```bash
terraform init -migrate-state
```

---

## よく使うコマンド

```bash
# リソースの状態を確認
terraform show

# 出力値を確認
terraform output

# 特定リソースだけ更新
terraform apply -target=google_artifact_registry_repository.medimate

# リソースを削除 (注意: 本番環境では慎重に)
terraform destroy
```

---

## ディレクトリ構成

```
terraform/
├── main.tf                  # provider / backend 設定
├── variables.tf             # 変数定義
├── outputs.tf               # 出力値
├── apis.tf                  # GCP API の有効化
├── artifact_registry.tf     # Artifact Registry (Docker リポジトリ)
├── secret_manager.tf        # Secret Manager (シークレット定義)
├── iam.tf                   # Service Account + IAM 権限
├── terraform.tfvars         # 変数の値 (.gitignore 対象)
└── terraform.tfvars.example # 変数ファイルのサンプル
```
