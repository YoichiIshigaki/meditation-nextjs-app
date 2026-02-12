const admin = {
  // Sidebar
  dashboard: "ダッシュボード",
  contents: "コンテンツ管理",
  categories: "カテゴリー管理",
  backToDashboard: "ダッシュボードに戻る",

  // Dashboard
  adminDashboard: "管理画面",
  totalContents: "コンテンツ数",
  totalCategories: "カテゴリー数",
  recentContents: "最近のコンテンツ",

  // Contents
  contentList: "コンテンツ一覧",
  createContent: "コンテンツ作成",
  editContent: "コンテンツ編集",
  title: "タイトル",
  description: "説明",
  category: "カテゴリー",
  duration: "再生時間",
  language: "言語",
  imageUrl: "画像",
  audioUrl: "音声",
  videoUrl: "動画URL",
  actions: "操作",
  edit: "編集",
  delete: "削除",
  noContents: "コンテンツがありません",
  seconds: "秒",
  selectCategory: "カテゴリーを選択",

  // Categories
  categoryList: "カテゴリー一覧",
  createCategory: "カテゴリー作成",
  editCategory: "カテゴリー編集",
  name: "名前",
  slug: "スラッグ",
  description: "説明",
  order: "表示順",
  noCategories: "カテゴリーがありません",

  // Form
  submit: "保存",
  cancel: "キャンセル",
  submitting: "保存中...",
  create: "新規作成",
  creating: "作成中...",

  // Messages
  createSuccess: "作成しました",
  updateSuccess: "更新しました",
  deleteSuccess: "削除しました",
  deleteConfirm: "本当に削除しますか？",
  error: "エラーが発生しました",
  notFound: "コンテンツが見つかりません",

  // Validation
  validation_title_required: "タイトルを入力してください",
  validation_title_max: "タイトルは200文字以内で入力してください",
  validation_description_required: "説明を入力してください",
  validation_description_max: "説明は2000文字以内で入力してください",
  validation_url_invalid: "有効なURLを入力してください",
  validation_duration_min: "再生時間は0以上で入力してください",
  validation_language_required: "言語を選択してください",
  validation_category_required: "カテゴリーを選択してください",
  validation_name_required: "名前を入力してください",
  validation_name_max: "名前は100文字以内で入力してください",
  validation_slug_required: "スラッグを入力してください",
  validation_slug_max: "スラッグは50文字以内で入力してください",
  validation_slug_format: "スラッグは小文字英数字とハイフンのみ使用できます",
  validation_description_max_category: "説明は500文字以内で入力してください",
  validation_order_min: "表示順は0以上で入力してください",
} as const;

export default admin;
