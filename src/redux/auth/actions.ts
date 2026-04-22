// constants
import { AuthActionTypes } from "./constants";

export interface AuthActionType {
  type:
  | AuthActionTypes.API_RESPONSE_SUCCESS
  | AuthActionTypes.API_RESPONSE_ERROR
  | AuthActionTypes.FORGOT_PASSWORD
  | AuthActionTypes.FORGOT_PASSWORD_CHANGE
  | AuthActionTypes.LOGIN_USER
  | AuthActionTypes.LOGOUT_USER
  | AuthActionTypes.RESET
  | AuthActionTypes.SIGNUP_USER;
  payload: {} | string;
}

interface UserData {
  id: number;
  phone_no: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  token: string;
}

// common success
export const authApiResponseSuccess = (
  actionType: string,
  data: UserData | {}
): AuthActionType => ({
  type: AuthActionTypes.API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const authApiResponseError = (
  actionType: string,
  error: string
) => ({
  type: AuthActionTypes.API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const loginUser = (phone_no: string, password: string): AuthActionType => ({
  type: AuthActionTypes.LOGIN_USER,
  payload: { phone_no, password },
});

export const logoutUser = (): AuthActionType => ({
  type: AuthActionTypes.LOGOUT_USER,
  payload: {},
});

export const signupUser = (
  fullname: string,
  email: string,
  password: string
): AuthActionType => ({
  type: AuthActionTypes.SIGNUP_USER,
  payload: { fullname, email, password },
});

export const forgotPassword = (phone_no: string): AuthActionType => ({
  type: AuthActionTypes.FORGOT_PASSWORD,
  payload: { phone_no },
});

export const resetAuth = (): AuthActionType => ({
  type: AuthActionTypes.RESET,
  payload: {},
});
