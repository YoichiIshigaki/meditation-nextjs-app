const validation = {
  password: {
    required: "Password is required.",
    minLength: "Password must be at least 6 characters.",
  },
  confirmPassword: {
    required: "Please enter your password again.",
    mismatch: "Passwords do not match.",
  },
  email: {
    required: "Email address is required.",
    regex: "",
  },
  firstName: {
    required: "First name is required.",
  },
  lastName: {
    required: "Last name is required.",
  },
} as const;

export default validation;
