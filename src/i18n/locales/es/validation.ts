const validation = {
  password: {
    required: "La contraseña es obligatoria.",
    minLength: "La contraseña debe tener al menos 6 caracteres.",
  },
  confirmPassword: {
    required: "Por favor, introduzca la contraseña de nuevo",
    mismatch: "Las contraseñas no coinciden.",
  },
  email: {
    required: "El correo electrónico es obligatorio.",
    regex: "",
  },
  firstName: {
    required: "El nombre es obligatorio.",
  },
  lastName: {
    required: "El apellido es obligatorio.",
  },
} as const;

export default validation;
