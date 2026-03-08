This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## add setting localstack aws cli command

`.zshrc`のファイルを開く

```
code ~/.zshrc
```

`.zshrc`のファイルに下記のエイリアスを追加

```
alias awslocal='aws --endpoint-url=http://localhost:4566  --profile localstack'
```

## Firestoreのデプロイ

### 初回セットアップ

1. **Firebase CLIにログイン**

   **重要**: 以下のコマンドを**ターミナルで直接実行**してください（npmスクリプト経由では実行できません）：

   ```bash
   npx firebase login
   ```

   ブラウザが開き、Googleアカウントでログインします。

   **注意**: 認証エラー（401）が発生する場合は、一度ログアウトしてから再ログインしてください：

   ```bash
   npx firebase logout
   npx firebase login
   ```

2. **Firebaseプロジェクトの設定**
   - `.firebaserc`ファイルが既に作成されている場合は、そのまま使用できます
   - プロジェクトIDを変更する場合は、`.firebaserc`ファイルを編集するか、以下のコマンドで設定:

   ```bash
   npm run firestore:init
   ```

   または、手動でプロジェクトを設定:

   ```bash
   npx firebase use --add
   ```

   プロンプトでFirebaseプロジェクトIDを選択または入力します。

3. **利用可能なプロジェクトを確認（オプション）**
   ```bash
   npm run firestore:list
   ```

### デプロイコマンド

```bash
# Firestoreルールのみをデプロイ
npm run firestore:deploy:rules

# Firestoreインデックスのみをデプロイ
npm run firestore:deploy:indexes

# Firestoreルールとインデックスの両方をデプロイ
npm run firestore:deploy
```

### 注意事項

- 初回デプロイ時は、`.firebaserc`ファイルが自動的に作成されます
- 複数のFirebaseプロジェクトを使用する場合は、`firebase use <project-id>`でプロジェクトを切り替えられます

## 週次瞑想論文ダイジェストメール配信

### 機能概要

毎週月曜日の朝9時（JST）に、PubMedから最新の瞑想・マインドフルネス研究論文を取得し、Claude AIで要約してアクティブユーザー全員にメール配信する機能です。

```
毎週月曜 9:00 JST（0:00 UTC）
  ↓ Vercel Cron が自動実行
GET /api/cron/weekly-paper-digest
  ↓
PubMed API から最新論文を5件取得（過去30日）
  ↓
Claude AI でユーザーの言語（日本語/英語/スペイン語）に合わせて要約
  ↓
Firestoreのアクティブユーザー全員にResendでメール送信
```

### 仕様

| 項目 | 内容 |
|---|---|
| 実行スケジュール | 毎週月曜 0:00 UTC（9:00 JST） |
| 論文ソース | PubMed（NCBI E-utilities API、無料・認証不要） |
| 取得論文数 | 最新5件（過去30日以内） |
| 要約モデル | Claude Sonnet 4.6（`claude-sonnet-4-6`） |
| 対応言語 | 日本語（ja）/ 英語（en）/ スペイン語（es） |
| 送信対象 | Firestoreの `status: "active"` ユーザー全員 |
| メール送信 | Resend |
| 認証 | `Authorization: Bearer {CRON_SECRET}` ヘッダーで保護 |
| タイムアウト | 最大5分（`maxDuration = 300`） |

### 必要な環境変数

`.env.local` に追加：

```bash
ANTHROPIC_API_KEY=sk-ant-...      # Anthropic APIキー
CRON_SECRET=your-random-secret    # Cronジョブ認証用シークレット（下記コマンドで生成）
```

`CRON_SECRET` の生成方法：

```bash
openssl rand -hex 32
```

### ローカルでのテスト

開発サーバーを起動した状態で実行：

```bash
# .env.local の CRON_SECRET を使って手動実行
npm run cron:test:weekly-paper-digest
```

### Vercel へのデプロイ

#### 1. Vercel プロジェクトを作成・接続

```bash
# Vercel CLI をインストール（未インストールの場合）
npm i -g vercel

# プロジェクトを Vercel に接続（初回のみ）
vercel
```

または Vercel ダッシュボードで GitHub リポジトリを接続。

#### 2. 環境変数を Vercel に設定

Vercel ダッシュボード → **Project Settings → Environment Variables** で以下を追加：

| 変数名 | 説明 |
|---|---|
| `ANTHROPIC_API_KEY` | Anthropic APIキー |
| `CRON_SECRET` | Cronジョブ認証用シークレット |
| `RESEND_API_KEY` | Resend APIキー |
| `EMAIL_FROM` | 送信元メールアドレス |
| `NEXTAUTH_SECRET` | NextAuth シークレット |
| `NEXTAUTH_URL` | アプリのURL（例: `https://your-app.vercel.app`） |
| `FIREBASE_ADMIN_CREDENTIALS` | Firebase Admin 認証情報 |
| `FIREBASE_CLIENT_CREDENTIALS` | Firebase Client 認証情報 |

#### 3. 本番デプロイ

```bash
vercel --prod
```

または `main` ブランチへのプッシュで GitHub 連携による自動デプロイ。

#### 4. Cron ジョブの確認

デプロイ後、Vercel ダッシュボード → **プロジェクト → Cron Jobs** タブでスケジュールを確認・手動実行できます。

> **注意**: Cron ジョブは**本番デプロイのみ**で動作します。プレビューデプロイでは実行されません。
