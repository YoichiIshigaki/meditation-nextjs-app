const validation = {
  password: {
    required: "パスワードは必須です。",
    minLength: "パスワードは6文字以上で入力してください。",
  },
  confirmPassword: {
    required: "もう一度パスワードを入力してください",
    mismatch: "パスワードが一致しません。",
  },
  email: {
    required: "メールアドレスは必須です。",
    regex: "",
  },
  firstName: {
    required: "名は必須です。",
  },
  lastName: {
    required: "姓は必須です。",
  },
} as const;

export default validation;
