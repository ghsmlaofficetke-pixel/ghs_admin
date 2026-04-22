import { APICore } from "../../helpers/api/apiCore";
import { AuthActionTypes } from "./constants";

const api = new APICore();

const INIT_STATE = {
  user: api.getLoggedInUser() || null,
  loading: false,
  error: null,
  userLoggedIn: false,
  userLogout: false,
  userSignUp: false,
  passwordReset: false,
  resetPasswordSuccess: null,
};

interface State {
  user?: any;
  loading?: boolean;
  error?: string | null;
  userLoggedIn?: boolean;
  userLogout?: boolean;
  userSignUp?: boolean;
  passwordReset?: boolean;
  resetPasswordSuccess?: any;
}

const Auth = (state: State = INIT_STATE, action: any): State => {
  switch (action.type) {

    /* ===============================
       SUCCESS
    =============================== */
    case AuthActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {

        case AuthActionTypes.LOGIN_USER:
          return {
            ...state,
            user: action.payload.data,
            loading: false,
            error: null,
            userLoggedIn: true,
          };

        case AuthActionTypes.SIGNUP_USER:
          return {
            ...state,
            loading: false,
            error: null,
            userSignUp: true,
          };

        case AuthActionTypes.LOGOUT_USER:
          return {
            ...state,
            user: null,
            loading: false,
            error: null,
            userLogout: true,
          };

        case AuthActionTypes.FORGOT_PASSWORD:
          return {
            ...state,
            loading: false,
            error: null,
            passwordReset: true,
            resetPasswordSuccess: action.payload.data,
          };

        default:
          return state;
      }

    /* ===============================
       ERROR
    =============================== */
    case AuthActionTypes.API_RESPONSE_ERROR:
  switch (action.payload.actionType) {
    case AuthActionTypes.LOGIN_USER: {
      return {
        ...state,
        error: action.payload.error,
        userLoggedIn: false,
        loading: false,
      };
    }

        case AuthActionTypes.SIGNUP_USER:
          return {
            ...state,
            loading: false,
            error: action.payload.error,
            userSignUp: false,
          };

        case AuthActionTypes.FORGOT_PASSWORD:
          return {
            ...state,
            loading: false,
            error: action.payload.error,
            passwordReset: false,
          };

        default:
          return state;
      }

    /* ===============================
       REQUEST STATES
    =============================== */
    case AuthActionTypes.LOGIN_USER:
      return {
        ...state,
        loading: true,
        error: null,
        userLoggedIn: false,
      };

    case AuthActionTypes.LOGOUT_USER:
      return {
        ...state,
        loading: true,
        error: null,
        userLogout: false,
      };

    case AuthActionTypes.SIGNUP_USER:
      return {
        ...state,
        loading: true,
        error: null,
        userSignUp: false,
      };

    /* ===============================
       RESET
    =============================== */
    case AuthActionTypes.RESET:
      return {
        ...INIT_STATE,
        user: api.getLoggedInUser() || null,
      };

    default:
      return state;
  }
};

export default Auth;