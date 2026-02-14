const reset_password = {
  title: "パスワードリセット",
  subtitle: "新しいパスワードを入力してください",
  new_password: "新しいパスワード",
  confirm_password: "パスワード確認",
  reset_password: "パスワードを変更",
  resetting: "変更中...",
  success: "パスワードが正常に変更されました！",
  go_to_login: "ログインへ",
  error: "パスワードの変更に失敗しました。もう一度お試しください。",
  error_invalid_link: "無効なリンク",
  error_invalid_link_description:
    "このパスワードリセットリンクは無効または期限切れです。",
  request_new_link: "新しいリンクをリクエスト",
  // バリデーションメッセージ
  validation_password_min: "パスワードは6文字以上で入力してください",
  validation_confirm_required: "パスワード確認は必須です",
  validation_password_mismatch: "パスワードが一致しません",
} as const;

export default reset_password;
