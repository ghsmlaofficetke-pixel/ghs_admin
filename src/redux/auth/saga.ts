import { all, fork, put, takeEvery, call } from "redux-saga/effects";
import { SagaIterator } from "@redux-saga/core";

// api
import { APICore } from "../../helpers/api/apiCore";

// api calls
import {
  login as loginApi,
  logout as logoutApi,
  signup as signupApi,
  forgotPassword as forgotPasswordApi,
} from "../../helpers/api/auth";

// actions
import { authApiResponseSuccess, authApiResponseError } from "./actions";

// constants
import { AuthActionTypes } from "./constants";

interface UserData {
  payload: {
    phone_no?: string;
    password?: string;
    fullname?: string;
    email?: string;
  };
  type: string;
}

const api = new APICore();

/* ===============================
   LOGIN
================================ */
function* login({
  payload: { phone_no, password },
}: UserData): SagaIterator {
  try {
    const response = yield call(loginApi, { phone_no, password });

    const token =
      response?.data?.token ||
      response?.data?.data?.token;

console.log(response)

    if (!token) {
      throw new Error("Invalid phone number or password");
    }

    api.setLoggedInUser(token);

    yield put(
      authApiResponseSuccess(AuthActionTypes.LOGIN_USER, { token })
    );
  } catch (error: any) {
console.log(error)

    const errorMessage =
      error ||
      "Invalid phone number or password";

    api.setLoggedInUser(null);

    yield put(
      authApiResponseError(
        AuthActionTypes.LOGIN_USER,
        errorMessage
      )
    );
  }
}

/* ===============================
   LOGOUT
================================ */
function* logout(): SagaIterator {
  try {
    yield call(logoutApi);

    // ✅ Remove token properly
    api.setLoggedInUser(null);

    yield put(
      authApiResponseSuccess(AuthActionTypes.LOGOUT_USER, {})
    );
  } catch (error: any) {
    api.setLoggedInUser(null); // still remove token even if API fails

    yield put(
      authApiResponseError(
        AuthActionTypes.LOGOUT_USER,
        "Logout failed"
      )
    );
  }
}

/* ===============================
   SIGNUP
================================ */
function* signup({
  payload: { fullname, email, password },
}: UserData): SagaIterator {
  try {
    const response = yield call(signupApi, {
      fullname,
      email,
      password,
    });

    yield put(
      authApiResponseSuccess(
        AuthActionTypes.SIGNUP_USER,
        response.data
      )
    );
  } catch (error: any) {
    yield put(
      authApiResponseError(
        AuthActionTypes.SIGNUP_USER,
        "Signup failed"
      )
    );
  }
}

/* ===============================
   FORGOT PASSWORD
================================ */
function* forgotPassword({
  payload: { phone_no },
}: UserData): SagaIterator {
  try {
    const response = yield call(forgotPasswordApi, { phone_no });

    yield put(
      authApiResponseSuccess(
        AuthActionTypes.FORGOT_PASSWORD,
        response.data
      )
    );
  } catch (error: any) {
    yield put(
      authApiResponseError(
        AuthActionTypes.FORGOT_PASSWORD,
        "Request failed"
      )
    );
  }
}

/* ===============================
   WATCHERS
================================ */
export function* watchLoginUser() {
  yield takeEvery(AuthActionTypes.LOGIN_USER, login);
}

export function* watchLogout() {
  yield takeEvery(AuthActionTypes.LOGOUT_USER, logout);
}

export function* watchSignup() {
  yield takeEvery(AuthActionTypes.SIGNUP_USER, signup);
}

export function* watchForgotPassword() {
  yield takeEvery(AuthActionTypes.FORGOT_PASSWORD, forgotPassword);
}

/* ===============================
   ROOT SAGA
================================ */
export default function* authSaga() {
  yield all([
    fork(watchLoginUser),
    fork(watchLogout),
    fork(watchSignup),
    fork(watchForgotPassword),
  ]);
}
