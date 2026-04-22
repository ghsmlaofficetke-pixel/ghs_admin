import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AppDispatch, RootState } from "../redux/store";
import { toast } from "react-toastify";

/* =======================
   API BASE URL
======================= */
const API_URL = import.meta.env.VITE_API_BASE_URL;

/* =======================
   TYPES (✅ FIXED)
======================= */
export interface Adhiveshana {
  _id?: string;
  date: string;
  type: string;
  department: string;
  description: string;
}

interface AdhiveshanaState {
  list: Adhiveshana[];
  current: Adhiveshana | null;
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
const initialState: AdhiveshanaState = {
  list: [],
  current: null,
  loading: false,
  hasError: false,
};

/* =======================
   SLICE
======================= */
const adhiveshanaSlice = createSlice({
  name: "adhiveshana",
  initialState,
  reducers: {
    start: (state) => {
      state.loading = true;
      state.hasError = false;
    },

    getAllSuccess: (state, action: PayloadAction<Adhiveshana[]>) => {
      state.loading = false;
      state.list = action.payload;
    },

    getCurrentSuccess: (
      state,
      action: PayloadAction<Adhiveshana | null>
    ) => {
      state.loading = false;
      state.current = action.payload;
    },

    failure: (state) => {
      state.loading = false;
      state.hasError = true;
    },

    clearAdhiveshanaState: (state) => {
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
  clearAdhiveshanaState,
} = adhiveshanaSlice.actions;

export const adhiveshanaSelector = (state: RootState) =>
  state.adhiveshana;

export default adhiveshanaSlice.reducer;

/* =======================
   THUNKS
======================= */

// ✅ Fetch ALL
export const fetchAllAdhiveshana = () => async (dispatch: AppDispatch) => {
  dispatch(start());
  try {
    const res = await axios.get(
      `${API_URL}/adhiveshana`,
      getAuthConfig()
    );

    console.log(res)

    dispatch(getAllSuccess(res.data.data || res.data));
  } catch (err: any) {
    dispatch(failure());
    toast.error(
      err?.response?.data?.message || "Failed to load adhiveshana"
    );
  }
};

// ✅ Fetch SINGLE
export const fetchAdhiveshanaById =
  (id: string) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      const res = await axios.get(
        `${API_URL}/adhiveshana/${id}`,
        getAuthConfig()
      );

      dispatch(getCurrentSuccess(res.data.data || res.data));
    } catch (err: any) {
      dispatch(failure());
      toast.error(
        err?.response?.data?.message || "Failed to load adhiveshana"
      );
    }
  };

// ✅ CREATE
export const createAdhiveshana =
  (payload: Adhiveshana) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.post(
        `${API_URL}/adhiveshana`,
        payload,
        getAuthConfig()
      );

      toast.success("Adhiveshana created successfully");

      dispatch(fetchAllAdhiveshana());
    } catch (err: any) {
      dispatch(failure());
      toast.error(
        err?.response?.data?.message || "Create failed"
      );
    }
  };

// ✅ UPDATE
export const updateAdhiveshana =
  (id: string, payload: Adhiveshana) =>
  async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.put(
        `${API_URL}/adhiveshana/${id}`,
        payload,
        getAuthConfig()
      );

      toast.success("Adhiveshana updated successfully");

      dispatch(fetchAllAdhiveshana());
    } catch (err: any) {
      dispatch(failure());
      toast.error(
        err?.response?.data?.message || "Update failed"
      );
    }
  };

// ✅ DELETE
export const deleteAdhiveshana =
  (id: string) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.delete(
        `${API_URL}/adhiveshana/${id}`,
        getAuthConfig()
      );

      toast.success("Adhiveshana deleted successfully");

      dispatch(fetchAllAdhiveshana());
    } catch (err: any) {
      dispatch(failure());
      toast.error(
        err?.response?.data?.message || "Delete failed"
      );
    }
  };