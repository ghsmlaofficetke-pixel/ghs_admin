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
export interface GramaPanchayath {
  _id?: string;
  name_en: string;
  name_kn: string;
  hobliId: string;
}

interface GramaPanchayathState {
  list: GramaPanchayath[];
  current?: GramaPanchayath | null;
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
const initialState: GramaPanchayathState = {
  list: [],
  current: null,
  loading: false,
  hasError: false,
};

/* =======================
   Slice
======================= */
const gramaPanchayathSlice = createSlice({
  name: "gramaPanchayath",
  initialState,
  reducers: {
    start: (state) => {
      state.loading = true;
      state.hasError = false;
    },
    getAllSuccess: (state, action: PayloadAction<GramaPanchayath[]>) => {
      state.loading = false;
      state.list = action.payload;
    },
    getCurrentSuccess: (state, action: PayloadAction<GramaPanchayath | null>) => {
      state.loading = false;
      state.current = action.payload;
    },
    failure: (state) => {
      state.loading = false;
      state.hasError = true;
    },

    clearGramaPanchayathState: (state) => {
  state.list = [];
  state.current = null;
  state.loading = false;
  state.hasError = false;
},
  },
});

export const { start, getAllSuccess, getCurrentSuccess, failure , clearGramaPanchayathState,  } = gramaPanchayathSlice.actions;
export const gramaPanchayathSelector = (state: RootState) => state.gramaPanchayath;
export default gramaPanchayathSlice.reducer;

/* =======================
   Thunks
======================= */


 export const fetchAllGramaPanchayaths = () => async (dispatch: AppDispatch) => {
  dispatch(start());
  try {
    const res = await axios.get(`${API_URL}/grama-panchayaths`,getAuthConfig());
    dispatch(getAllSuccess(res.data.data || res.data));
  } catch (err: any) {
    dispatch(failure());
    toast.error(err?.response?.data?.message || "Failed to load Hoblis");
  }
};

// Fetch all Grama Panchayaths by Hobli
export const fetchGramaPanchayaths =
  (hobliId: string) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      const res = await axios.get(`${API_URL}/grama-panchayaths/hobli/${hobliId}`, getAuthConfig());
      dispatch(getAllSuccess(res.data.data || res.data));
      console.log(res)
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "Failed to load Grama Panchayaths");
    }
  };

// Fetch a single Grama Panchayath by ID
export const fetchGramaPanchayathById =
  (id: string) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      const res = await axios.get(`${API_URL}/grama-panchayaths/${id}`, getAuthConfig());
      dispatch(getCurrentSuccess(res.data.data || res.data));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "Failed to load Grama Panchayath");
    }
  };

// Create Grama Panchayath
export const createGramaPanchayath =
  (payload: GramaPanchayath) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.post(`${API_URL}/grama-panchayaths`, payload, getAuthConfig());
      toast.success("Grama Panchayath created");
      dispatch(fetchGramaPanchayaths(payload.hobliId));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "Create failed");
    }
  };

// Update Grama Panchayath
export const updateGramaPanchayath =
  (id: string, payload: GramaPanchayath) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.put(`${API_URL}/grama-panchayaths/${id}`, payload, getAuthConfig());
      toast.success("Grama Panchayath updated");
      dispatch(fetchGramaPanchayaths(payload.hobliId));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

// Delete Grama Panchayath
export const deleteGramaPanchayath =
  (id: string, hobliId: string) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.delete(`${API_URL}/grama-panchayaths/${id}`, getAuthConfig());
      toast.success("Grama Panchayath deleted");
      dispatch(fetchGramaPanchayaths(hobliId));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };
