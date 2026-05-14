import axios from "axios";
import jwtDecode from "jwt-decode";

/* ===============================
   AXIOS BASE CONFIG
================================ */
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.headers.post["Content-Type"] = "application/json";

// ✅ Timeout - 15 seconds ನಂತರ hang ಆಗದಂತೆ cancel ಮಾಡು
axios.defaults.timeout = 15000;

/* ===============================
   TOKEN STORAGE KEY
================================ */
const AUTH_TOKEN_KEY = "token";

/* ===============================
   ✅ REQUEST DEDUPLICATION CACHE
   ಒಂದೇ API ಒಮ್ಮೆಲೆ 2 ಬಾರಿ call ಆದರೆ
   second call wait ಮಾಡ್ತದೆ - duplicate request ಇಲ್ಲ
================================ */
const pendingRequests = new Map<string, Promise<any>>();

/* ===============================
   ✅ SIMPLE IN-MEMORY CACHE
   GET requests - 30 seconds cache
   ಇದರಿಂದ same data ಬಾರಿ ಬಾರಿ fetch ಆಗೋದು ನಿಲ್ಲ್ತದೆ
================================ */
interface CacheEntry {
  data: any;
  timestamp: number;
}
const requestCache = new Map<string, CacheEntry>();
const CACHE_TTL = 30 * 1000; // 30 seconds

const getCached = (key: string): any | null => {
  const entry = requestCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    requestCache.delete(key);
    return null;
  }
  return entry.data;
};

const setCache = (key: string, data: any) => {
  // ✅ Cache max 50 entries - memory ಮಿತಿ
  if (requestCache.size >= 50) {
    const firstKey = requestCache.keys().next().value;
    if (firstKey) requestCache.delete(firstKey);
  }
  requestCache.set(key, { data, timestamp: Date.now() });
};

/* ===============================
   SET / REMOVE AUTH HEADER
================================ */
const setAuthorization = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    // ✅ sessionStorage - tab close ಆದ ಮೇಲೆ clear (more secure than localStorage)
    sessionStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_TOKEN_KEY, token); // backward compat
  } else {
    delete axios.defaults.headers.common["Authorization"];
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    // ✅ Logout ಆದಾಗ cache clear ಮಾಡು
    requestCache.clear();
    pendingRequests.clear();
  }
};

/* ===============================
   AXIOS RESPONSE INTERCEPTOR
================================ */
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // ✅ Timeout error - user friendly message
    if (error.code === "ECONNABORTED") {
      return Promise.reject("ಸರ್ವರ್ ತಡವಾಗ್ತಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.");
    }

    if (!error?.response) {
      return Promise.reject("Network error. Internet connection ಪರೀಕ್ಷಿಸಿ.");
    }

    const status = error.response.status;
    const backendMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data?.msg;

    let message = "Something went wrong";

    switch (status) {
      case 401:
        const token =
          sessionStorage.getItem(AUTH_TOKEN_KEY) ||
          localStorage.getItem(AUTH_TOKEN_KEY);
        if (token) {
          setAuthorization(null);
        }
        message = backendMessage || "Session expire ಆಗಿದೆ. ಮತ್ತೆ login ಮಾಡಿ.";
        break;

      case 403:
        message = backendMessage || "ಈ page ನೋಡಲು permission ಇಲ್ಲ.";
        break;

      case 404:
        message = backendMessage || "Data ಸಿಗಲಿಲ್ಲ.";
        break;

      case 429:
        // ✅ Rate limit - too many requests
        message = "ಬಹಳ ಬೇಗ requests ಕಳಿಸ್ತಿದ್ದೀರಿ. ಸ್ವಲ್ಪ ತಡೆದು ಪ್ರಯತ್ನಿಸಿ.";
        break;

      case 500:
      case 502:
      case 503:
        message = backendMessage || "Server error. ಸ್ವಲ್ಪ ಹೊತ್ತು ತಡೆದು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.";
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

  /* ---------- GET with CACHE + DEDUP ---------- */
  get = (url: string, params?: any) => {
    const cacheKey = `GET:${url}:${JSON.stringify(params || {})}`;

    // ✅ Cache hit - server ಗೆ ಹೋಗದೆ instant return
    const cached = getCached(cacheKey);
    if (cached) {
      return Promise.resolve({ data: cached });
    }

    // ✅ Already pending - ಅದೇ promise return (duplicate request ಇಲ್ಲ)
    if (pendingRequests.has(cacheKey)) {
      return pendingRequests.get(cacheKey)!;
    }

    const request = axios
      .get(url, { params })
      .then((res) => {
        setCache(cacheKey, res.data);
        pendingRequests.delete(cacheKey);
        return res;
      })
      .catch((err) => {
        pendingRequests.delete(cacheKey);
        throw err;
      });

    pendingRequests.set(cacheKey, request);
    return request;
  };

  getFile = (url: string, params?: any) =>
    axios.get(url, { params, responseType: "blob" });

  /* ---------- WRITE methods - cache invalidate ಮಾಡು ---------- */
  create = (url: string, data: any) => {
    this._invalidateCacheForUrl(url);
    return axios.post(url, data);
  };

  update = (url: string, data: any) => {
    this._invalidateCacheForUrl(url);
    return axios.put(url, data);
  };

  updatePatch = (url: string, data: any) => {
    this._invalidateCacheForUrl(url);
    return axios.patch(url, data);
  };

  delete = (url: string) => {
    this._invalidateCacheForUrl(url);
    return axios.delete(url);
  };

  createWithFile = (url: string, data: any) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => formData.append(key, data[key]));
    this._invalidateCacheForUrl(url);
    return axios.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  updateWithFile = (url: string, data: any) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => formData.append(key, data[key]));
    this._invalidateCacheForUrl(url);
    return axios.patch(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  /* ---------- Cache helpers ---------- */
  // ✅ Write ಆದ ಮೇಲೆ related cache clear ಮಾಡು
  private _invalidateCacheForUrl = (url: string) => {
    const baseUrl = url.split("?")[0].split("/").slice(0, 3).join("/");
    for (const key of requestCache.keys()) {
      if (key.includes(baseUrl)) {
        requestCache.delete(key);
      }
    }
  };

  // ✅ Manual cache clear - logout / refresh ಗಾಗಿ
  clearCache = () => {
    requestCache.clear();
    pendingRequests.clear();
  };

  /* ---------- AUTH HELPERS ---------- */
  setLoggedInUser = (token: string | null) => {
    setAuthorization(token);
  };

  getLoggedInUser = () => {
    const token =
      sessionStorage.getItem(AUTH_TOKEN_KEY) ||
      localStorage.getItem(AUTH_TOKEN_KEY);
    return token ? { token } : null;
  };

  isUserAuthenticated = () => {
    const token =
      sessionStorage.getItem(AUTH_TOKEN_KEY) ||
      localStorage.getItem(AUTH_TOKEN_KEY);
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
const token =
  sessionStorage.getItem(AUTH_TOKEN_KEY) ||
  localStorage.getItem(AUTH_TOKEN_KEY);
if (token) {
  setAuthorization(token);
}

/* ===============================
   EXPORTS
================================ */
export { APICore, setAuthorization };