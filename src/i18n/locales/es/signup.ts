const signup = {
  title: "Crear Cuenta",
  subtitle: "Crea una nueva cuenta para comenzar",
  first_name: "Nombre",
  last_name: "Apellido",
  email: "Correo electrónico",
  password: "Contraseña",
  confirm_password: "Confirmar contraseña",
  sign_up: "Registrarse",
  signing_up: "Registrando...",
  or: "o",
  have_account: "¿Ya tienes una cuenta?",
  login: "Iniciar sesión",
  success: "¡Cuenta creada exitosamente!",
  error: "Error en el registro. Por favor intenta de nuevo.",
  error_email_exists: "Este correo ya está en uso.",
  // Mensajes de validación
  validation_email_invalid: "Por favor ingresa un correo electrónico válido",
  validation_password_min: "La contraseña debe tener al menos 6 caracteres",
  validation_first_name_required: "El nombre es obligatorio",
  validation_last_name_required: "El apellido es obligatorio",
  validation_confirm_password_required:
    "La confirmación de contraseña es obligatoria",
  validation_password_mismatch: "Las contraseñas no coinciden",
  validation_first_name_max: "El nombre debe tener 20 caracteres o menos",
  validation_last_name_max: "El apellido debe tener 20 caracteres o menos",
} as const;

export default signup;
