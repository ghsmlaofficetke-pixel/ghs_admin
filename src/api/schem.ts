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

// ✅ ADD THIS (missing earlier)
export interface Schem {
  _id?: string;
  name: string;
  description?: string;
}

// ❌ REMOVE wrong Statdata from here (not needed)

/* =======================
   STATE
======================= */
interface SchemState {
  list: Schem[];
  current: Schem | null;
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

    getAllSuccess: (state, action: PayloadAction<Schem[]>) => {
      state.loading = false;
      state.list = action.payload;
    },

    getCurrentSuccess: (state, action: PayloadAction<Schem | null>) => {
      state.loading = false;
      state.current = action.payload;
    },

    failure: (state) => {
      state.loading = false;
      state.hasError = true;
    },

    clearSchemState: (state) => {
      state.list = [];
      state.current = null;
      state.loading = false;
      state.hasError = false;
    },
  },
});

export const {
  start,
  getAllSuccess,
  getCurrentSuccess,
  failure,
  clearSchemState,
} = schemSlice.actions;

export const schemSelector = (state: RootState) => state.schem;

export default schemSlice.reducer;

/* =======================
   THUNKS
======================= */

// ✅ Fetch ALL
export const fetchAllSchem = () => async (dispatch: AppDispatch) => {
  dispatch(start());
  try {
    const res = await axios.get(`${API_URL}/schem`, getAuthConfig());
    dispatch(getAllSuccess(res.data.data || res.data));
  } catch (err: any) {
    dispatch(failure());
    toast.error(err?.response?.data?.message || "Failed to load schem");
  }
};

// ✅ Fetch single
export const fetchSchemById =
  (id: string) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      const res = await axios.get(
        `${API_URL}/schem/${id}`,
        getAuthConfig()
      );
      dispatch(getCurrentSuccess(res.data.data || res.data));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "Failed to load schem");
    }
  };

// ✅ Create
export const createSchem =
  (payload: Schem) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.post(`${API_URL}/schem`, payload, getAuthConfig());
      toast.success("Schem created successfully");

      // refresh
      dispatch(fetchAllSchem());
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "Create failed");
    }
  };

// ✅ Update
export const updateSchem =
  (id: string, payload: Schem) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.put(`${API_URL}/schem/${id}`, payload, getAuthConfig());
      toast.success("Schem updated successfully");

      dispatch(fetchAllSchem());
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

// ✅ Delete
export const deleteSchem =
  (id: string) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.delete(`${API_URL}/schem/${id}`, getAuthConfig());
      toast.success("Schem deleted successfully");

      dispatch(fetchAllSchem());
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };