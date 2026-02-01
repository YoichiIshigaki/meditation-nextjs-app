const signup = {
  title: "Create Account",
  subtitle: "Create a new account to get started",
  first_name: "First Name",
  last_name: "Last Name",
  email: "Email",
  password: "Password",
  confirm_password: "Confirm Password",
  sign_up: "Sign Up",
  signing_up: "Signing up...",
  or: "or",
  have_account: "Already have an account?",
  login: "Login",
  success: "Account created successfully!",
  error: "Registration failed. Please try again.",
  error_email_exists: "This email is already in use.",
  // Validation messages
  validation_email_invalid: "Please enter a valid email address",
  validation_password_min: "Password must be at least 6 characters",
  validation_first_name_required: "First name is required",
  validation_last_name_required: "Last name is required",
  validation_confirm_password_required: "Password confirmation is required",
  validation_password_mismatch: "Passwords do not match",
  validation_first_name_max: "First name must be 20 characters or less",
  validation_last_name_max: "Last name must be 20 characters or less",
} as const;

export default signup;
