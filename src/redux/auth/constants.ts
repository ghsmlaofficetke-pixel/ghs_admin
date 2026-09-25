export enum AuthActionTypes {
  API_RESPONSE_SUCCESS = "@@auth/API_RESPONSE_SUCCESS",
  API_RESPONSE_ERROR   = "@@auth/API_RESPONSE_ERROR",
  ADMIN_LOGIN          = "@@auth/ADMIN_LOGIN",   // direct login for admin/superadmin
  LOGIN_USER           = "@@auth/LOGIN_USER",    // user step-1 (request OTP)
  VERIFY_OTP           = "@@auth/VERIFY_OTP",   // user step-2
  LOGOUT_USER          = "@@auth/LOGOUT_USER",
  SIGNUP_USER          = "@@auth/SIGNUP_USER",
  FORGOT_PASSWORD      = "@@auth/FORGOT_PASSWORD",
  RESET                = "@@auth/RESET",
}
