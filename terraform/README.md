# Terraform セットアップガイド

## 前提条件

- [Homebrew](https://brew.sh/) がインストール済みであること
- [gcloud CLI](https://cloud.google.com/sdk/docs/install) がインストール済みであること
- GCP プロジェクトが作成済みであること
- GNU grep がインストール済みであること (tfenv の要件)

### GNU grep のインストール (macOS)

macOS の標準 grep は BSD 版のため、tfenv が動作しません。
以下のコマンドで `grep` コマンドを再度インストールしてください。

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

# Application Default Credentials を設定 (Terraform が使用) ※必須
gcloud auth application-default login

# 操作対象のプロジェクトを設定
gcloud auth application-default set-quota-project YOUR_PROJECT_ID
```

> **注意**: `gcloud auth application-default login` を実行しないと、`terraform plan` / `apply` 時に以下のエラーが発生します。
>
> ```
> Error: Attempted to load application default credentials since neither `credentials`
> nor `access_token` was set in the provider block. No credentials loaded.
> To use your gcloud credentials, run 'gcloud auth application-default login'
> ```

---

## 4. 変数ファイルの確認

環境ごとの変数ファイルは `environments/` 配下に用意されています。
`project_id` を実際の GCP プロジェクト ID に変更してください。

```
terraform/environments/
├── development/terraform.tfvars
├── staging/terraform.tfvars
└── production/terraform.tfvars
```

---

## 5. 初回セットアップ

環境ごとに独立したディレクトリで操作します。Workspace は使用しません。

### development 環境

```bash
cd terraform/environments/development

terraform init -backend-config=backend.tfvars
terraform plan
terraform apply
```

### staging 環境

```bash
cd terraform/environments/staging

terraform init -backend-config=backend.tfvars
terraform plan
terraform apply
```

### production 環境

```bash
cd terraform/environments/production

terraform init -backend-config=backend.tfvars
terraform plan
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

## 7. GCS バックエンドのセットアップ

GCS バケット自体も Terraform (bootstrap) で管理します。
`backend/` ディレクトリは GCS バケットが存在しないため、ローカル state で動作します。

### 7-1. バケットを作成 (bootstrap)

```bash
cd terraform/backend

terraform init
terraform apply
```

バケット名が出力されます。

```bash
terraform output tfstate_bucket_name
# vue3-tutorial-127e1-tfstate
```

### 7-2. メイン設定の state を GCS に移行

`terraform/main.tf` の backend はすでに設定済みです。

```bash
cd terraform
terraform init -migrate-state
```

`yes` と入力して確定します。移行後の GCS の state ファイル構成：

```
gs://vue3-tutorial-127e1-tfstate/medimate/
└── env:/
    ├── development.tfstate
    ├── staging.tfstate
    └── production.tfstate
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
├── backend/                      # GCS バケット作成用 (bootstrap)
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── terraform.tfvars          # (.gitignore 対象)
├── modules/
│   └── app/                      # 共通リソース定義
│       ├── main.tf
│       ├── variables.tf
│       └── outputs.tf
└── environments/
    ├── development/
    │   ├── main.tf               # backend + module 呼び出し
    │   ├── variables.tf
    │   ├── backend.tfvars        # GCS backend 設定
    │   └── terraform.tfvars      # (.gitignore 対象)
    ├── staging/
    │   ├── main.tf
    │   ├── variables.tf
    │   ├── backend.tfvars
    │   └── terraform.tfvars
    └── production/
        ├── main.tf
        ├── variables.tf
        ├── backend.tfvars
        └── terraform.tfvars
```
