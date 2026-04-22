import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AppDispatch, RootState } from "../redux/store";
import { toast } from "react-toastify";

/* =======================
   API BASE URL
======================= */
const API_URL = import.meta.env.VITE_API_BASE_URL;

/* =======================
   Types
======================= */
export interface Wardmanavi {
  _id?: string;
  date?: string;
  work: string;
  description?: string;
  refer?: string;
  ward: string; // <-- IMPORTANT: this is wardId
}

interface WardmanaviState {
  list: Wardmanavi[];
  current?: Wardmanavi | null;
  loading: boolean;
  hasError: boolean;
}

/* =======================
   Auth Header
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
   Initial State
======================= */
const initialState: WardmanaviState = {
  list: [],
  current: null,
  loading: false,
  hasError: false,
};

/* =======================
   Slice
======================= */
const wardmanaviSlice = createSlice({
  name: "wardmanavi",
  initialState,
  reducers: {
    start: (state) => {
      state.loading = true;
      state.hasError = false;
    },
    getAllSuccess: (state, action: PayloadAction<Wardmanavi[]>) => {
      state.loading = false;
      state.list = action.payload;
    },
    getCurrentSuccess: (state, action: PayloadAction<Wardmanavi | null>) => {
      state.loading = false;
      state.current = action.payload;
    },
    failure: (state) => {
      state.loading = false;
      state.hasError = true;
    },
  },
});

export const { start, getAllSuccess, getCurrentSuccess, failure } =
  wardmanaviSlice.actions;

export const wardmanaviSelector = (state: RootState) => state.wardmanavi;

export default wardmanaviSlice.reducer;

/* =======================
   Thunks
======================= */

// Fetch all Wardmanavi by Ward
export const fetchWardmanaviByWard =
  (wardId: string) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      const res = await axios.get(
        `${API_URL}/wardmanavi/ward/${wardId}`,
        getAuthConfig()
      );
      dispatch(getAllSuccess(res.data.data || res.data));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "Failed to load Wardmanavi");
    }
  };

// Fetch single Wardmanavi by ID
export const fetchWardmanaviById =
  (id: string) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      const res = await axios.get(`${API_URL}/wardmanavi/${id}`, getAuthConfig());
      dispatch(getCurrentSuccess(res.data.data || res.data));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "Failed to load Wardmanavi");
    }
  };

// Create Wardmanavi
export const createWardmanavi =
  (payload: Wardmanavi) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.post(`${API_URL}/wardmanavi`, payload, getAuthConfig());
      toast.success("ಮನವಿ ಸೇರಿಸಲಾಗಿದೆ");

      // Reload list for same ward
      dispatch(fetchWardmanaviByWard(payload.ward));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "Create failed");
    }
  };

// Update Wardmanavi
export const updateWardmanavi =
  (id: string, payload: Wardmanavi) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.put(`${API_URL}/wardmanavi/${id}`, payload, getAuthConfig());
      toast.success("ಮನವಿ ಅಪ್ಡೇಟ್ ಆಗಿದೆ");

      dispatch(fetchWardmanaviByWard(payload.ward));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

// Delete Wardmanavi
export const deleteWardmanavi =
  (id: string, wardId: string) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.delete(`${API_URL}/wardmanavi/${id}`, getAuthConfig());
      toast.success("ಮನವಿ ಡಿಲೀಟ್ ಆಗಿದೆ");

      dispatch(fetchWardmanaviByWard(wardId));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };
