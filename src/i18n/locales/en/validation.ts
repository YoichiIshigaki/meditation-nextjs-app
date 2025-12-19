const validation = {
  password: {
    required: "Password is required.",
  },
  confirmPassword: {
    required: "Please enter your password again.",
  },
  email: {
    required: "Email address is required.",
    regex: "",
  },
} as const;

export default validation;
