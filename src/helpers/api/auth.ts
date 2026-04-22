import { APICore } from "./apiCore";

const api = new APICore();

// account
function login(params: { phone_no: string; password: string }) {
  console.log(params)
  const baseUrl = "/users/login/";
  return api.create(`${baseUrl}`, params);
}

function logout() {
  const baseUrl = "/logout/";
  return api.create(`${baseUrl}`, {});
}

function signup(params: { fullname: string; email: string; password: string }) {
  const baseUrl = "/register/";
  return api.create(`${baseUrl}`, params);
}

function forgotPassword(params: { phone_no: string }) {
  const baseUrl = "/forgot-password/";
  return api.create(`${baseUrl}`, params);
}

export { login, logout, signup, forgotPassword };
