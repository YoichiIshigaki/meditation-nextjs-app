const validation = {
  password: {
    required: "La contraseña es obligatoria.",
  },
  confirmPassword: {
    required: "Por favor, introduzca la contraseña de nuevo",
  },
  email: {
    required: "El correo electrónico es obligatorio.",
    regex: "",
  },
} as const;

export default validation;
