import { all, fork, put, takeEvery, call } from "redux-saga/effects";
import { SagaIterator } from "@redux-saga/core";
import { APICore } from "../../helpers/api/apiCore";
import { adminLogin as adminLoginApi, requestLoginOtp, verifyLoginOtp, logout as logoutApi } from "../../helpers/api/auth";
import { authApiResponseSuccess, authApiResponseError } from "./actions";
import { AuthActionTypes } from "./constants";

const api = new APICore();

/* ── Admin/SuperAdmin direct login ── */
function* adminLogin({ payload: { phone_no, password } }: any): SagaIterator {
  try {
    const res  = yield call(adminLoginApi, { phone_no, password });
    const token = res?.data?.data?.token || res?.data?.token;
    const user  = res?.data?.data?.user  || res?.data?.user;
    if (!token) throw new Error("Login failed");
    api.setLoggedInUser(token);
    // Store role info for sidebar
    localStorage.setItem("userRole", user?.role || "admin");
    localStorage.setItem("userInfo", JSON.stringify(user));
    localStorage.setItem("allowedMenus", JSON.stringify(user?.allowedMenus || []));
    yield put(authApiResponseSuccess(AuthActionTypes.ADMIN_LOGIN, { token, ...user }));
  } catch (error: any) {
    yield put(authApiResponseError(AuthActionTypes.ADMIN_LOGIN,
      typeof error === "string" ? error : error?.message || "Login failed"));
  }
}

/* ── User step-1: request OTP ── */
function* login({ payload: { phone_no, password } }: any): SagaIterator {
  try {
    const res = yield call(requestLoginOtp, { phone_no, password });
    const data = res?.data?.data || res?.data;
    if (data?.skipOtp && data?.token) {
      // ✅ known device — logged in directly, no OTP screen
      api.setLoggedInUser(data.token);
      localStorage.setItem("userRole", data.user?.role || "user");
      localStorage.setItem("userInfo", JSON.stringify(data.user));
      localStorage.setItem("allowedMenus", JSON.stringify(data.user?.allowedMenus || []));
      yield put(authApiResponseSuccess(AuthActionTypes.VERIFY_OTP, { token: data.token, ...data.user }));
      return;
    }
    const msg = res?.data?.message || data?.message;
    if (!msg) throw new Error("OTP request failed");
    yield put(authApiResponseSuccess(AuthActionTypes.LOGIN_USER, { phone_no }));
  } catch (error: any) {
    yield put(authApiResponseError(AuthActionTypes.LOGIN_USER,
      typeof error === "string" ? error : error?.message || "Login failed"));
  }
}

/* ── User step-2: verify OTP ── */
function* verifyOtp({ payload: { phone_no, otp } }: any): SagaIterator {
  try {
    const res   = yield call(verifyLoginOtp, { phone_no, otp });
    const token = res?.data?.data?.token || res?.data?.token;
    const user  = res?.data?.data?.user  || res?.data?.user;
    if (!token) throw new Error("OTP verification failed");
    api.setLoggedInUser(token);
    localStorage.setItem("userRole", user?.role || "user");
    localStorage.setItem("userInfo", JSON.stringify(user));
    localStorage.setItem("allowedMenus", JSON.stringify(user?.allowedMenus || []));
    yield put(authApiResponseSuccess(AuthActionTypes.VERIFY_OTP, { token, ...user }));
  } catch (error: any) {
    yield put(authApiResponseError(AuthActionTypes.VERIFY_OTP,
      typeof error === "string" ? error : error?.message || "Invalid OTP"));
  }
}

/* ── Logout ── */
function* logout(): SagaIterator {
  try { yield call(logoutApi); } catch {}
  api.setLoggedInUser(null);
  localStorage.removeItem("userRole");
  localStorage.removeItem("userInfo");
  localStorage.removeItem("allowedMenus");
  yield put(authApiResponseSuccess(AuthActionTypes.LOGOUT_USER, {}));
}

export function* watchAdminLogin()  { yield takeEvery(AuthActionTypes.ADMIN_LOGIN,  adminLogin); }
export function* watchLogin()       { yield takeEvery(AuthActionTypes.LOGIN_USER,   login); }
export function* watchVerifyOtp()   { yield takeEvery(AuthActionTypes.VERIFY_OTP,   verifyOtp); }
export function* watchLogout()      { yield takeEvery(AuthActionTypes.LOGOUT_USER,  logout); }

export default function* authSaga() {
  yield all([fork(watchAdminLogin), fork(watchLogin), fork(watchVerifyOtp), fork(watchLogout)]);
}