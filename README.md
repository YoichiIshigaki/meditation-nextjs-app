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
