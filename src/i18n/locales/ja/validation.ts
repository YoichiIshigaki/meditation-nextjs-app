const validation = {
  password: {
    required: 'パスワードは必須です。',
  },
  confirmPassword: {
    required: 'もう一度パスワードを入力してください',
  },
  email: {
    required: 'メールアドレスは必須です。',
    regex: '',

  }
}

export default validation;