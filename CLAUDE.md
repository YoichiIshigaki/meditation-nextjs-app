# プロジェクトコンテキスト

## 概要
瞑想アプリ (medimate app) - Next.js 14 App Routerを使用したWebアプリケーション

## 技術スタック
- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **認証**: NextAuth.js + Firebase Auth
- **データベース**: Firebase Firestore
- **ストレージ**: Firebase Storage
- **メール送信**: Resend
- **状態管理**: React Query (TanStack Query)
- **フォーム**: React Hook Form + Zod
- **アイコン**: Lucide React

## ディレクトリ構造

```
src/
├── app/                    # Next.js App Router
│   ├── [lang]/            # 多言語対応 (ja, en, es)
│   │   ├── login/         # ログイン画面
│   │   ├── signup/        # 新規登録画面
│   │   ├── forgot-password/ # パスワード再設定リクエスト画面
│   │   ├── reset-password/  # パスワードリセット画面
│   │   └── dashboard/     # ダッシュボード
│   └── api/               # APIルート
│       └── auth/          # 認証関連API
├── components/            # 共通コンポーネント
├── config/               # 設定ファイル
├── hooks/                # カスタムフック
├── i18n/                 # 国際化 (i18next)
│   ├── locales/          # 言語ファイル
│   │   ├── ja/           # 日本語
│   │   ├── en/           # 英語
│   │   └── es/           # スペイン語
│   ├── client.tsx        # クライアント用i18n設定
│   ├── server.ts         # サーバー用i18n設定
│   └── settings.ts       # i18n共通設定（namespaces定義）
├── infra/                # インフラ層
│   └── email/            # メール送信
│       ├── index.ts      # メール送信ロジック
│       └── templates/    # HTMLメールテンプレート
├── lib/                  # ユーティリティ
│   ├── firebase.ts       # Firebase Client SDK（クライアント用）
│   ├── firebaseAdmin.ts  # Firebase Admin SDK（サーバー用）
│   ├── auth.ts           # 認証ヘルパー関数
│   └── nextAuth.ts       # NextAuth設定
├── middlewares/          # ミドルウェア
├── models/               # データモデル（Firestore操作）
└── schema/               # Zodバリデーションスキーマ
```

## コーディング規約

### ファイル命名規則
- コンポーネント: PascalCase（例: `AppIcon.tsx`）
- フック: camelCaseで`use`プレフィックス（例: `useToast.ts`）
- ユーティリティ: camelCase（例: `auth.ts`）
- スキーマ: camelCase（例: `signup.ts`, `resetPassword.ts`）

### 国際化（i18n）
- 翻訳キーは `namespace:key` 形式で使用（例: `login:title`）
- 新しいnamespaceを追加する手順:
  1. `src/i18n/locales/{lang}/{namespace}.ts` を各言語分作成
  2. `src/i18n/locales/{lang}/translation.ts` にimportを追加
  3. `src/i18n/settings.ts` の `namespaces` 配列に追加

### Zodスキーマ
- API用とフォーム用でスキーマを分離する
- フォーム用は翻訳対応のため関数化する（例: `createSignUpFormSchema(t)`）
- 配置場所: `src/schema/`

### API呼び出し
- `usePostApi`, `useGetApi` などのカスタムフックを使用
- レスポンス型: `{ success: boolean; error?: string; ... }`

### 認証
- 公開ルート（未認証でアクセス可能）: `src/middlewares/authMiddleware.ts` の `publicRoutes` に追加
- サーバーサイド: Firebase Admin SDKを使用
- クライアントサイド: Firebase Client SDKを使用

### メールテンプレート
- HTMLファイル: `src/infra/email/templates/{name}.html`
- プレースホルダー: `{{key}}` 形式で記述
- `src/infra/email/templates/index.ts` でファイル読み込みと文字列置換を行う

## 環境変数
```
AUTH_NEXT=                      # NextAuthのシークレットキー
NEXTAUTH_URL=                   # アプリのベースURL
FIREBASE_ADMIN_CREDENTIALS=     # Firebase Admin認証情報のファイルパス
FIREBASE_CLIENT_CREDENTIALS=    # Firebase Client認証情報のファイルパス
RESEND_API_KEY=                 # ResendのAPIキー
EMAIL_FROM=                     # 送信元メールアドレス（デフォルト: onboarding@resend.dev）
```

## よく使うコマンド
```bash
npm run dev      # 開発サーバー起動
npm run build    # 本番ビルド
npm run lint     # ESLint実行
```
