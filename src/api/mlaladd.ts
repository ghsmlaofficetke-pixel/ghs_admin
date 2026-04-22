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
export interface MLALADD {
  _id?: string;
  year: string;
  phase: string;
  work_description: string;
  amount: number;
  department: string;
  remark?: string;
}

interface MLALADDState {
  list: MLALADD[];
  current: MLALADD | null;
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
const initialState: MLALADDState = {
  list: [],
  current: null,
  loading: false,
  hasError: false,
};

/* =======================
   SLICE
======================= */
const mlaladdSlice = createSlice({
  name: "mlaladd",
  initialState,
  reducers: {
    start: (state) => {
      state.loading = true;
      state.hasError = false;
    },

    getAllSuccess: (state, action: PayloadAction<MLALADD[]>) => {
      state.loading = false;
      state.list = action.payload;
    },

    getCurrentSuccess: (state, action: PayloadAction<MLALADD | null>) => {
      state.loading = false;
      state.current = action.payload;
    },

    failure: (state) => {
      state.loading = false;
      state.hasError = true;
    },

    clearMLALADDState: (state) => {
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
  clearMLALADDState,
} = mlaladdSlice.actions;

export const mlaladdSelector = (state: RootState) => state.mlaladd;
export default mlaladdSlice.reducer;

/* =======================
   THUNKS
======================= */

// ✅ Fetch ALL
export const fetchAllMLALADD = () => async (dispatch: AppDispatch) => {
  dispatch(start());
  try {
    const res = await axios.get(`${API_URL}/mlaladd`, getAuthConfig());
    dispatch(getAllSuccess(res.data.data || res.data));
  } catch (err: any) {
    dispatch(failure());
    toast.error(err?.response?.data?.message || "Failed to load MLALADD");
  }
};

// ✅ Fetch by Year
export const fetchMLALADDByYear =
  (year: string) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      const res = await axios.get(
        `${API_URL}/mlaladd/year/${year}`,
        getAuthConfig()
      );
      dispatch(getAllSuccess(res.data.data || res.data));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "Failed to load by year");
    }
  };

// ✅ Fetch by Phase
export const fetchMLALADDByPhase =
  (phase: string) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      const res = await axios.get(
        `${API_URL}/mlaladd/phase/${phase}`,
        getAuthConfig()
      );
      dispatch(getAllSuccess(res.data.data || res.data));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "Failed to load by phase");
    }
  };

// ✅ Fetch single
export const fetchMLALADDById =
  (id: string) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      const res = await axios.get(
        `${API_URL}/mlaladd/${id}`,
        getAuthConfig()
      );
      dispatch(getCurrentSuccess(res.data.data || res.data));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "Failed to load item");
    }
  };

// ✅ CREATE
export const createMLALADD =
  (payload: MLALADD) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.post(`${API_URL}/mlaladd`, payload, getAuthConfig());

      toast.success("MLALADD created successfully");

      dispatch(fetchAllMLALADD()); // refresh list
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "Create failed");
    }
  };

// ✅ UPDATE
export const updateMLALADD =
  (id: string, payload: MLALADD) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.put(
        `${API_URL}/mlaladd/${id}`,
        payload,
        getAuthConfig()
      );

      toast.success("MLALADD updated successfully");

      dispatch(fetchAllMLALADD());
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

// ✅ DELETE
export const deleteMLALADD =
  (id: string) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.delete(`${API_URL}/mlaladd/${id}`, getAuthConfig());

      toast.success("MLALADD deleted successfully");

      dispatch(fetchAllMLALADD());
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };