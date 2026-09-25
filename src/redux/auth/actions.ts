import { AuthActionTypes } from "./constants";

export const authApiResponseSuccess = (actionType: string, data: any) => ({
  type: AuthActionTypes.API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
export const authApiResponseError = (actionType: string, error: string) => ({
  type: AuthActionTypes.API_RESPONSE_ERROR,
  payload: { actionType, error },
});

// Admin/SuperAdmin direct login
export const adminLoginAction = (phone_no: string, password: string) => ({
  type: AuthActionTypes.ADMIN_LOGIN,
  payload: { phone_no, password },
});

// Regular user: step-1
export const loginUser = (phone_no: string, password: string) => ({
  type: AuthActionTypes.LOGIN_USER,
  payload: { phone_no, password },
});

// Regular user: step-2
export const verifyOtp = (phone_no: string, otp: string) => ({
  type: AuthActionTypes.VERIFY_OTP,
  payload: { phone_no, otp },
});

export const logoutUser = () => ({ type: AuthActionTypes.LOGOUT_USER, payload: {} });
export const signupUser = (fullname: string, email: string, password: string) => ({
  type: AuthActionTypes.SIGNUP_USER, payload: { fullname, email, password },
});
export const resetAuth = () => ({ type: AuthActionTypes.RESET, payload: {} });
