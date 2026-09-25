import { APICore } from "./apiCore";
const api = new APICore();

// Admin/SuperAdmin direct login (no OTP)
function adminLogin(params: { phone_no: string; password: string }) {
  return api.create("/users/admin-login", params);
}

// Regular user login step-1
function requestLoginOtp(params: { phone_no: string; password: string }) {
  return api.create("/users/request-otp", params);
}

// Regular user login step-2
function verifyLoginOtp(params: { phone_no: string; otp: string }) {
  return api.create("/users/verify-otp", params);
}

function logout() {
  return api.create("/users/logout", {});
}

function signup(params: any) {
  return api.create("/users/register", params);
}

function forgotPassword(params: { phone_no: string }) {
  return api.create("/users/forgot-password", params);
}

export { adminLogin, requestLoginOtp, verifyLoginOtp, logout, signup, forgotPassword };
export { requestLoginOtp as login };
