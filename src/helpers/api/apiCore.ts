import axios from "axios";
import jwtDecode from "jwt-decode";

/* ===============================
   AXIOS BASE CONFIG
================================ */
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.headers.post["Content-Type"] = "application/json";

/* ===============================
   TOKEN STORAGE KEY
================================ */
const AUTH_TOKEN_KEY = "token";

/* ===============================
   SET / REMOVE AUTH HEADER
================================ */
const setAuthorization = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
};

/* ===============================
   AXIOS RESPONSE INTERCEPTOR
================================ */
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = "Something went wrong";

    if (!error?.response) {
      return Promise.reject("Network error. Please try again.");
    }

    const status = error.response.status;
    const backendMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data?.msg;

    switch (status) {
      case 401:
        // ❗ Only clear token if already logged in
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        if (token) {
          setAuthorization(null);
        }

        message = backendMessage || "Unauthorized access";
        break;

      case 403:
        message = backendMessage || "Access forbidden";
        break;

      case 404:
        message = backendMessage || "Resource not found";
        break;

      default:
        message = backendMessage || error.message || message;
    }

    return Promise.reject(message);
  }
);

/* ===============================
   API CORE CLASS
================================ */
class APICore {
  /* ---------- HTTP METHODS ---------- */
  get = (url: string, params?: any) => axios.get(url, { params });

  getFile = (url: string, params?: any) =>
    axios.get(url, { params, responseType: "blob" });

  create = (url: string, data: any) => axios.post(url, data);

  update = (url: string, data: any) => axios.put(url, data);

  updatePatch = (url: string, data: any) => axios.patch(url, data);

  delete = (url: string) => axios.delete(url);

  createWithFile = (url: string, data: any) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) =>
      formData.append(key, data[key])
    );

    return axios.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  updateWithFile = (url: string, data: any) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) =>
      formData.append(key, data[key])
    );

    return axios.patch(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  /* ---------- AUTH HELPERS ---------- */

  setLoggedInUser = (token: string | null) => {
    setAuthorization(token);
  };

  getLoggedInUser = () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    return token ? { token } : null;
  };

  isUserAuthenticated = () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      return decoded.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  };
}

/* ===============================
   RESTORE TOKEN ON PAGE REFRESH
================================ */
const token = localStorage.getItem(AUTH_TOKEN_KEY);
if (token) {
  setAuthorization(token);
}

/* ===============================
   EXPORTS
================================ */
export { APICore, setAuthorization };
