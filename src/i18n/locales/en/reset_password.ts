const reset_password = {
  title: "Reset Password",
  subtitle: "Enter your new password",
  new_password: "New Password",
  confirm_password: "Confirm Password",
  reset_password: "Reset Password",
  resetting: "Resetting...",
  success: "Your password has been successfully changed!",
  go_to_login: "Go to Login",
  error: "Failed to reset password. Please try again.",
  error_invalid_link: "Invalid Link",
  error_invalid_link_description:
    "This password reset link is invalid or has expired.",
  request_new_link: "Request New Link",
  // Validation messages
  validation_password_min: "Password must be at least 6 characters",
  validation_confirm_required: "Password confirmation is required",
  validation_password_mismatch: "Passwords do not match",
} as const;

export default reset_password;
