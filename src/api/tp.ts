import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { AppDispatch, RootState } from "../redux/store";

/* =======================
   API BASE URL (Vite)
======================= */

const API_URL = import.meta.env.VITE_API_BASE_URL;

/* =======================
   Types
======================= */

export interface TPEvent {
  time: string;
  title: string;
  description?: string;
  location?: string;
}

export interface TP {
  _id?: string;
  date: string;
  events: TPEvent[];
}

interface TPState {
  all_tp: TP[];
  current_tp: TP | null;
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

const initialState: TPState = {
  all_tp: [],
  current_tp: null,
  loading: false,
  hasError: false,
};

/* =======================
   Slice
======================= */

const tpSlice = createSlice({
  name: "tp",
  initialState,
  reducers: {
    tpStart: (state) => {
      state.loading = true;
      state.hasError = false;
    },
    getAllTpSuccess: (state, action: PayloadAction<TP[]>) => {
      state.loading = false;
      state.all_tp = action.payload;
    },
    getCurrentTpSuccess: (state, action: PayloadAction<TP | null>) => {
      state.loading = false;
      state.current_tp = action.payload;
    },
    tpFailure: (state) => {
      state.loading = false;
      state.hasError = true;
    },
  },
});

export const {
  tpStart,
  getAllTpSuccess,
  getCurrentTpSuccess,
  tpFailure,
} = tpSlice.actions;

export const tpSelector = (state: RootState) => state.tp;
export default tpSlice.reducer;

/* =======================
   Thunks
======================= */

// Fetch all TP
export const fetchAllTp = () => async (dispatch: AppDispatch) => {
  dispatch(tpStart());
  try {
    const res = await axios.get(
      `${API_URL}/tp`,
      getAuthConfig()
    );
    dispatch(getAllTpSuccess(res.data.data));
  } catch (err: any) {
    dispatch(tpFailure());
    toast.error(err?.response?.data?.message || "Failed to load Today Plans");
  }
};

// Create TP
export const createTp = (payload: TP) => async (dispatch: AppDispatch) => {
  dispatch(tpStart());
  try {
    await axios.post( `${API_URL}/tp`, payload,getAuthConfig()

    
    );
    
    toast.success("Today Plan created");
    dispatch(fetchAllTp());
  } catch (err: any) {
    dispatch(tpFailure());
    toast.error(err?.response?.data?.message || "Create failed");
  }
};

// Update TP
export const updateTp =
  (id: string, payload: TP) => async (dispatch: AppDispatch) => {
    dispatch(tpStart());
    try {
      await axios.put(
        `${API_URL}/tp/${id}`,
        payload,
        getAuthConfig()
      );
      toast.success("Today Plan updated");
      dispatch(fetchAllTp());
    } catch (err: any) {
      dispatch(tpFailure());
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

// Delete TP
export const deleteTp = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(tpStart());
  try {
    await axios.delete(
      `${API_URL}/tp/${id}`,
      getAuthConfig()
    );
    toast.success("Today Plan deleted");
    dispatch(fetchAllTp());
  } catch (err: any) {
    dispatch(tpFailure());
    toast.error(err?.response?.data?.message || "Delete failed");
  }
};
