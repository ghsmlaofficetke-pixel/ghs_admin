import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AppDispatch, RootState } from "../redux/store";
import { toast } from "react-toastify";

/* =======================
   API BASE URL
======================= */
const API_URL = import.meta.env.VITE_API_BASE_URL;

/* =======================
   TYPES
======================= */

// ✅ Main Schem List
export interface Schem {
  _id?: string;
  name: string;
  description?: string;
}

// ✅ Details Table Data
export interface MainSchemData {
  _id?: string;
  year: string;
  administrative_department: string;
  work_description: string;
  implementation_department: string;
  amount: string;
  remark: string;
}

/* =======================
   STATE
======================= */
interface SchemState {
  list: Schem[];
  current: Schem | null;
  mainData: MainSchemData[];
  loading: boolean;
  hasError: boolean;
}

/* =======================
   AUTH HEADER
======================= */
const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

/* =======================
   INITIAL STATE
======================= */
const initialState: SchemState = {
  list: [],
  current: null,
  mainData: [],
  loading: false,
  hasError: false,
};

/* =======================
   SLICE
======================= */
const schemSlice = createSlice({
  name: "schem",
  initialState,
  reducers: {
    start: (state) => {
      state.loading = true;
      state.hasError = false;
    },

    // ✅ ALL SCHEMES
    getAllSuccess: (state, action: PayloadAction<Schem[]>) => {
      state.loading = false;
      state.list = action.payload;
    },

    // ✅ SINGLE SCHEME
    getCurrentSuccess: (state, action: PayloadAction<Schem | null>) => {
      state.loading = false;
      state.current = action.payload;
    },

    // ✅ MAIN TABLE DATA
    getMainDataSuccess: (
      state,
      action: PayloadAction<MainSchemData[]>
    ) => {
      state.loading = false;
      state.mainData = action.payload;
    },

    failure: (state) => {
      state.loading = false;
      state.hasError = true;
    },

    clearSchemState: (state) => {
      state.list = [];
      state.current = null;
      state.mainData = [];
      state.loading = false;
      state.hasError = false;
    },
  },
});

export const {
  start,
  getAllSuccess,
  getCurrentSuccess,
  getMainDataSuccess,
  failure,
  clearSchemState,
} = schemSlice.actions;

export const schemSelector = (state: RootState) => state.schemdata;

export default schemSlice.reducer;

/* =======================
   THUNKS
======================= */

// ✅ Fetch ALL SCHEMES
export const fetchAllSchem = () => async (dispatch: AppDispatch) => {
  dispatch(start());
  try {
    const res = await axios.get(`${API_URL}/schemdata`, getAuthConfig());
    dispatch(getAllSuccess(res.data.data || res.data));
  } catch (err: any) {
    dispatch(failure());
    toast.error(err?.response?.data?.message || "Failed to load schem");
  }
};

// ✅ Fetch TABLE DATA
export const fetchAllMainSchemData =
  (schemId: string) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      const res = await axios.get(
        `${API_URL}/schemdata/mainschem/${schemId}`,
        getAuthConfig()
      );
      // ✅ FIXED
      dispatch(getMainDataSuccess(res.data.data || res.data));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "Failed to load data");
    }
  };

// ✅ Fetch SINGLE SCHEME
export const fetchSchemById =
  (id: string) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      const res = await axios.get(
        `${API_URL}/schem/${id}`, // ✅ FIXED
        getAuthConfig()
      );
      dispatch(getCurrentSuccess(res.data.data || res.data));
    } catch (err: any) {
      dispatch(failure());
      toast.error("Failed to load schem");
    }
  };

// ✅ Create
export const createMainSchemData =
  (payload: any) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.post(`${API_URL}/schemdata`, payload, getAuthConfig());

      toast.success("ಮಾಹಿತಿ ಯಶಸ್ವಿಯಾಗಿ ಸೇರಿಸಲಾಗಿದೆ");

      dispatch(fetchAllMainSchemData(payload.schem)); // refresh
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "Create failed");
    }
  };

// ✅ Update
export const updateMainSchemData =
  (id: string, payload: any) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.put(`${API_URL}/schemdata/${id}`, payload, getAuthConfig());

      toast.success("ತಿದ್ದುಪಡಿ ಯಶಸ್ವಿಯಾಗಿದೆ");

      dispatch(fetchAllMainSchemData(payload.schem));
    } catch (err: any) {
      dispatch(failure());
      toast.error("Update failed");
    }
  };

// ✅ Delete
export const deleteMainSchemData =
  (id: string, schemId: string) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.delete(`${API_URL}/schemdata/${id}`, getAuthConfig());

      toast.success("ಅಳಿಸಲಾಗಿದೆ");

      dispatch(fetchAllMainSchemData(schemId));
    } catch (err: any) {
      dispatch(failure());
      toast.error("Delete failed");
    }
  };