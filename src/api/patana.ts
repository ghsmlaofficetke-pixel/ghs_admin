import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { AppDispatch, RootState } from "../redux/store";

/* =======================
   API BASE URL
======================= */
const API_URL = import.meta.env.VITE_API_BASE_URL;

/* =======================
   Types
======================= */
export interface patana {
  _id?: string;
  name_en: string;
  name_kn: string;
  blockId: string;
}

interface patanaState {
  list: patana[];
  current_patana: patana | null;
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
const initialState: patanaState = {
  list: [],
  current_patana: null,
  loading: false,
  hasError: false,
};

/* =======================
   Slice
======================= */
const patanaSlice = createSlice({
  name: "patana",
  initialState,
  reducers: {
    patanaStart: (state) => {
      state.loading = true;
      state.hasError = false;
    },

    getAllpatanaSuccess: (state, action: PayloadAction<patana[]>) => {
      state.loading = false;
      state.list = action.payload;
    },

    getCurrentpatanaSuccess: (state, action: PayloadAction<patana | null>) => {
      state.loading = false;
      state.current_patana = action.payload;
    },

    patanaFailure: (state) => {
      state.loading = false;
      state.hasError = true;
    },

    clearpatanaState: (state) => {
      state.list = [];
      state.current_patana = null;
      state.loading = false;
      state.hasError = false;
    },
  },
});

export const {
  patanaStart,
  getAllpatanaSuccess,
  getCurrentpatanaSuccess,
  patanaFailure,
  clearpatanaState,
} = patanaSlice.actions;

export const patanaSelector = (state: RootState) => state.patana;
export default patanaSlice.reducer;

/* =======================
   Thunks
======================= */

// Fetch all patanas for a Panchayath
export const fetchAllPanchayathpatana =
  (panchayathId: string) => async (dispatch: AppDispatch) => {
    dispatch(patanaStart());
    try {
      const res = await axios.get(
        `${API_URL}/patana/panchayath/${panchayathId}`,
        getAuthConfig()
      );

      dispatch(getAllpatanaSuccess(res.data.data || res.data));
    } catch (err: any) {
      dispatch(patanaFailure());
      toast.error(err?.response?.data?.message || "Failed to load patanas");
    }
  };

// Fetch all patanas
export const fetchAllpatana = () => async (dispatch: AppDispatch) => {
  dispatch(patanaStart());
  try {
    const res = await axios.get(`${API_URL}/patana`, getAuthConfig());

    console.log(res.data);
    dispatch(getAllpatanaSuccess(res.data.data || res.data));
  } catch (err: any) {
    dispatch(patanaFailure());
    toast.error(err?.response?.data?.message || "Failed to load patanas");
  }
};

// Create patana
export const createpatana =
  (payload: patana) => async (dispatch: AppDispatch) => {
    dispatch(patanaStart());
    try {
      await axios.post(`${API_URL}/patana`, payload, getAuthConfig());
      toast.success("Patana created");

      dispatch(fetchAllPanchayathpatana(payload.blockId));
    } catch (err: any) {
      dispatch(patanaFailure());
      toast.error(err?.response?.data?.message || "Create failed");
    }
  };

// Update patana
export const updatepatana =
  (id: string, payload: patana) => async (dispatch: AppDispatch) => {
    dispatch(patanaStart());
    try {
      await axios.put(
        `${API_URL}/patana/${id}`,
        payload,
        getAuthConfig()
      );

      toast.success("Patana updated");
      dispatch(fetchAllPanchayathpatana(payload.blockId));
    } catch (err: any) {
      dispatch(patanaFailure());
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

// Delete patana
export const deletepatana =
  (id: string, blockId: string) => async (dispatch: AppDispatch) => {
    dispatch(patanaStart());
    try {
      await axios.delete(
        `${API_URL}/patana/${id}`,
        getAuthConfig()
      );

      toast.success("Patana deleted");
      dispatch(fetchAllPanchayathpatana(blockId));
    } catch (err: any) {
      dispatch(patanaFailure());
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };