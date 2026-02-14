const admin = {
  // Sidebar
  dashboard: "Dashboard",
  contents: "Content Management",
  categories: "Category Management",
  backToDashboard: "Back to Dashboard",

  // Dashboard
  adminDashboard: "Admin Dashboard",
  totalContents: "Total Contents",
  totalCategories: "Total Categories",
  recentContents: "Recent Contents",

  // Contents
  contentList: "Content List",
  createContent: "Create Content",
  editContent: "Edit Content",
  title: "Title",
  description: "Description",
  category: "Category",
  duration: "Duration",
  language: "Language",
  imageUrl: "Image",
  audioUrl: "Audio",
  videoUrl: "Video URL",
  actions: "Actions",
  edit: "Edit",
  delete: "Delete",
  noContents: "No contents found",
  seconds: "sec",
  minutes: "min",
  selectCategory: "Select category",

  // Categories
  categoryList: "Category List",
  createCategory: "Create Category",
  editCategory: "Edit Category",
  name: "Name",
  slug: "Slug",
  description: "Description",
  order: "Order",
  noCategories: "No categories found",

  // Form
  submit: "Save",
  cancel: "Cancel",
  submitting: "Saving...",
  create: "Create",
  creating: "Creating...",

  // Messages
  createSuccess: "Created successfully",
  updateSuccess: "Updated successfully",
  deleteSuccess: "Deleted successfully",
  deleteConfirm: "Are you sure you want to delete?",
  error: "An error occurred",
  notFound: "Content not found",

  // Validation
  validation_title_required: "Title is required",
  validation_title_max: "Title must be 200 characters or less",
  validation_description_required: "Description is required",
  validation_description_max: "Description must be 2000 characters or less",
  validation_url_invalid: "Please enter a valid URL",
  validation_duration_min: "Duration must be 0 or greater",
  validation_language_required: "Please select a language",
  validation_category_required: "Please select a category",
  validation_name_required: "Name is required",
  validation_name_max: "Name must be 100 characters or less",
  validation_slug_required: "Slug is required",
  validation_slug_max: "Slug must be 50 characters or less",
  validation_slug_format:
    "Slug can only contain lowercase letters, numbers, and hyphens",
  validation_description_max_category:
    "Description must be 500 characters or less",
  validation_order_min: "Order must be 0 or greater",
} as const;

export default admin;
