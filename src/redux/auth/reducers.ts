import { APICore } from "../../helpers/api/apiCore";
import { AuthActionTypes } from "./constants";

const api = new APICore();

const INIT_STATE = {
  user:         api.getLoggedInUser() || null,
  loading:      false,
  error:        null as string | null,
  userLoggedIn: false,
  userLogout:   false,
  otpSent:      false,
  otpPhone:     null as string | null,
};

const Auth = (state = INIT_STATE, action: any) => {
  switch (action.type) {

    case AuthActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {

        case AuthActionTypes.ADMIN_LOGIN:
          return { ...state, loading: false, error: null, user: action.payload.data, userLoggedIn: true };

        case AuthActionTypes.LOGIN_USER:
          return { ...state, loading: false, error: null, otpSent: true, otpPhone: action.payload.data?.phone_no || null };

        case AuthActionTypes.VERIFY_OTP:
          return { ...state, loading: false, error: null, user: action.payload.data, userLoggedIn: true, otpSent: false };

        case AuthActionTypes.LOGOUT_USER:
          return { ...state, loading: false, error: null, user: null, userLogout: true, otpSent: false, otpPhone: null };

        default: return state;
      }

    case AuthActionTypes.API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case AuthActionTypes.ADMIN_LOGIN:
          return { ...state, loading: false, error: action.payload.error, userLoggedIn: false };
        case AuthActionTypes.LOGIN_USER:
          return { ...state, loading: false, error: action.payload.error, otpSent: false };
        case AuthActionTypes.VERIFY_OTP:
          return { ...state, loading: false, error: action.payload.error };
        default: return state;
      }

    case AuthActionTypes.ADMIN_LOGIN:
      return { ...state, loading: true, error: null, userLoggedIn: false };
    case AuthActionTypes.LOGIN_USER:
      return { ...state, loading: true, error: null, otpSent: false };
    case AuthActionTypes.VERIFY_OTP:
      return { ...state, loading: true, error: null };
    case AuthActionTypes.LOGOUT_USER:
      return { ...state, loading: true, userLogout: false };
    case AuthActionTypes.RESET:
      return { ...INIT_STATE, user: api.getLoggedInUser() || null };

    default: return state;
  }
};

export default Auth;
