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
export interface Ward {
  _id?: string;
  name: string;
  panchayatipatanaId: string;
}

interface WardState {
  list: Ward[];
  current: Ward | null;
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
const initialState: WardState = {
  list: [],
  current: null,
  loading: false,
  hasError: false,
};

/* =======================
   Slice
======================= */
const wardSlice = createSlice({
  name: "ward",
  initialState,
  reducers: {
    start: (state) => {
      state.loading = true;
      state.hasError = false;
    },
    getAllSuccess: (state, action: PayloadAction<Ward[]>) => {
      state.loading = false;
      state.list = action.payload;
    },
    getCurrentSuccess: (state, action: PayloadAction<Ward | null>) => {
      state.loading = false;
      state.current = action.payload;
    },
    failure: (state) => {
      state.loading = false;
      state.hasError = true;
    },

    clearWardState: (state) => {
  state.list = [];
  state.current = null;
  state.loading = false;
  state.hasError = false;
},
  },
});

export const {start,getAllSuccess,getCurrentSuccess,failure,clearWardState,} = wardSlice.actions;

export const wardSelector = (state: RootState) => state.ward;
export default wardSlice.reducer;

/* =======================
   Thunks
======================= */

// Fetch ALL wards
export const fetchAllWards = () => async (dispatch: AppDispatch) => {
  dispatch(start());
  try {
    const res = await axios.get(`${API_URL}/ward`, getAuthConfig());
    dispatch(getAllSuccess(res.data.data || res.data));
  } catch (err: any) {
    dispatch(failure());
    toast.error(err?.response?.data?.message || "Failed to load wards");
  }
};

// Fetch wards by PanchaythPatana
export const fetchPanchaythPatanaWards =
  (panchayatipatanaId: string) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      const res = await axios.get(
        `${API_URL}/ward/panchayatipatana/${panchayatipatanaId}`,
        getAuthConfig()
      );
      dispatch(getAllSuccess(res.data.data || res.data));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "Failed to load wards");
    }
  };

// Fetch single ward
export const fetchWardById =
  (id: string) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      const res = await axios.get(
        `${API_URL}/ward/${id}`,
        getAuthConfig()
      );
      dispatch(getCurrentSuccess(res.data.data || res.data));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "Failed to load ward");
    }
  };

// Create ward
export const createWard =
  (payload: Ward) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.post(`${API_URL}/ward`, payload, getAuthConfig());
      toast.success("Ward created successfully");

      // ✅ Refresh PanchaythPatana wards list
      dispatch(fetchPanchaythPatanaWards(payload.panchayatipatanaId));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "Create failed");
    }
  };

// Update ward
export const updateWard =
  (id: string, payload: Ward) => async (dispatch: AppDispatch) => {
    dispatch(start());

    try {
      await axios.put(`${API_URL}/ward/${id}`,payload,getAuthConfig());
      toast.success("Ward updated successfully");
      // ✅ Refresh PanchaythPatana wards list
      dispatch(fetchPanchaythPatanaWards(payload.panchayatipatanaId));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

// Delete ward
export const deleteWard =
  (id: string, panchayatipatanaId: string) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {await axios.delete(`${API_URL}/ward/${id}`,getAuthConfig());
      toast.success("Ward deleted successfully");
      // ✅ Refresh PanchaythPatana wards list
      dispatch(fetchPanchaythPatanaWards(panchayatipatanaId));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };
