const reset_password = {
  title: "Restablecer Contraseña",
  subtitle: "Ingresa tu nueva contraseña",
  new_password: "Nueva Contraseña",
  confirm_password: "Confirmar Contraseña",
  reset_password: "Restablecer Contraseña",
  resetting: "Restableciendo...",
  success: "¡Tu contraseña ha sido cambiada exitosamente!",
  go_to_login: "Ir a Iniciar Sesión",
  error: "Error al restablecer la contraseña. Por favor intenta de nuevo.",
  error_invalid_link: "Enlace Inválido",
  error_invalid_link_description:
    "Este enlace de restablecimiento de contraseña es inválido o ha expirado.",
  request_new_link: "Solicitar Nuevo Enlace",
  // Mensajes de validación
  validation_password_min: "La contraseña debe tener al menos 6 caracteres",
  validation_confirm_required: "La confirmación de contraseña es obligatoria",
  validation_password_mismatch: "Las contraseñas no coinciden",
} as const;

export default reset_password;
