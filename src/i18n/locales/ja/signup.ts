const signup = {
  title: "アカウント作成",
  subtitle: "新しいアカウントを作成してください",
  first_name: "名",
  last_name: "姓",
  email: "メールアドレス",
  password: "パスワード",
  confirm_password: "パスワード確認",
  sign_up: "登録する",
  signing_up: "登録中...",
  or: "または",
  have_account: "すでにアカウントをお持ちですか？",
  login: "ログイン",
  success: "アカウントを作成しました！",
  error: "登録に失敗しました。もう一度お試しください。",
  error_email_exists: "このメールアドレスは既に使用されています。",
  // バリデーションメッセージ
  validation_email_invalid: "有効なメールアドレスを入力してください",
  validation_password_min: "パスワードは6文字以上で入力してください",
  validation_first_name_required: "名は必須です",
  validation_last_name_required: "姓は必須です",
  validation_confirm_password_required: "パスワード確認は必須です",
  validation_password_mismatch: "パスワードが一致しません",
  validation_first_name_max: "名は20文字以下で入力してください",
  validation_last_name_max: "姓は20文字以下で入力してください",
} as const;

export default signup;
