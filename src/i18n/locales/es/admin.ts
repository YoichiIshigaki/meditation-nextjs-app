const admin = {
  // Sidebar
  dashboard: "Panel",
  contents: "Gestión de Contenidos",
  categories: "Gestión de Categorías",
  backToDashboard: "Volver al Panel",

  // Dashboard
  adminDashboard: "Panel de Administración",
  totalContents: "Total de Contenidos",
  totalCategories: "Total de Categorías",
  recentContents: "Contenidos Recientes",

  // Contents
  contentList: "Lista de Contenidos",
  createContent: "Crear Contenido",
  editContent: "Editar Contenido",
  title: "Título",
  description: "Descripción",
  category: "Categoría",
  duration: "Duración",
  language: "Idioma",
  imageUrl: "Imagen",
  audioUrl: "Audio",
  videoUrl: "URL del Video",
  actions: "Acciones",
  edit: "Editar",
  delete: "Eliminar",
  noContents: "No se encontraron contenidos",
  seconds: "seg",
  minutes: "min",
  selectCategory: "Seleccionar categoría",

  // Categories
  categoryList: "Lista de Categorías",
  createCategory: "Crear Categoría",
  editCategory: "Editar Categoría",
  name: "Nombre",
  slug: "Slug",
  description: "Descripción",
  order: "Orden",
  noCategories: "No se encontraron categorías",

  // Form
  submit: "Guardar",
  cancel: "Cancelar",
  submitting: "Guardando...",
  create: "Crear",
  creating: "Creando...",

  // Messages
  createSuccess: "Creado exitosamente",
  updateSuccess: "Actualizado exitosamente",
  deleteSuccess: "Eliminado exitosamente",
  deleteConfirm: "¿Está seguro de que desea eliminar?",
  error: "Ocurrió un error",
  notFound: "Contenido no encontrado",

  // Validation
  validation_title_required: "El título es obligatorio",
  validation_title_max: "El título debe tener 200 caracteres o menos",
  validation_description_required: "La descripción es obligatoria",
  validation_description_max:
    "La descripción debe tener 2000 caracteres o menos",
  validation_url_invalid: "Por favor ingrese una URL válida",
  validation_duration_min: "La duración debe ser 0 o mayor",
  validation_language_required: "Por favor seleccione un idioma",
  validation_category_required: "Por favor seleccione una categoría",
  validation_name_required: "El nombre es obligatorio",
  validation_name_max: "El nombre debe tener 100 caracteres o menos",
  validation_slug_required: "El slug es obligatorio",
  validation_slug_max: "El slug debe tener 50 caracteres o menos",
  validation_slug_format:
    "El slug solo puede contener letras minúsculas, números y guiones",
  validation_description_max_category:
    "La descripción debe tener 500 caracteres o menos",
  validation_order_min: "El orden debe ser 0 o mayor",
} as const;

export default admin;
