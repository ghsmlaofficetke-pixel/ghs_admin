// redux/wardIndWork.slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AppDispatch, RootState } from "../redux/store";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_BASE_URL;

/* ================= TYPES ================= */
export interface WardIndWork {
  _id?: string;
  name: string;
  address?: string;
  mobile?: string;
  scheme: string;
  orderNumber?: string;
  ward: string;
}

interface State {
  list: WardIndWork[];
  current?: WardIndWork | null;
  loading: boolean;
  hasError: boolean;
}

/* ================= AUTH ================= */
const authConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

/* ================= STATE ================= */
const initialState: State = {
  list: [],
  current: null,
  loading: false,
  hasError: false,
};

/* ================= SLICE ================= */
const slice = createSlice({
  name: "wardIndWork",
  initialState,
  reducers: {
    start: (s) => { s.loading = true; s.hasError = false; },
    getAllSuccess: (s, a: PayloadAction<WardIndWork[]>) => {
      s.loading = false; s.list = a.payload;
    },
    getOneSuccess: (s, a: PayloadAction<WardIndWork | null>) => {
      s.loading = false; s.current = a.payload;
    },
    failure: (s) => { s.loading = false; s.hasError = true; },
  },
});

export const {
  start,
  getAllSuccess,
  getOneSuccess,
  failure,
} = slice.actions;

export const wardIndWorkSelector = (s: RootState) => s.wardIndWork;
export default slice.reducer;

/* ================= THUNKS ================= */

// By Ward
export const fetchIndividualByWard =
  (wardId: string) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      const res = await axios.get(
        `${API_URL}/wardindwork/ward/${wardId}`,
        authConfig()
      );
      dispatch(getAllSuccess(res.data.data || res.data));
    } catch (e: any) {
      dispatch(failure());
      toast.error("Failed to load Individual works");
    }
  };

// Create
export const createWardIndWork =
  (payload: WardIndWork) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.post(`${API_URL}/wardindwork`, payload, authConfig());
      toast.success("ವೈಯಕ್ತಿಕ ಕಾಮಗಾರಿ ಸೇರಿಸಲಾಗಿದೆ");
      dispatch(fetchIndividualByWard(payload.ward));
    } catch (e: any) {
      dispatch(failure());
      toast.error("Create failed");
    }
  };

// Update
export const updateWardIndWork =
  (id: string, payload: WardIndWork) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.put(`${API_URL}/wardindwork/${id}`, payload, authConfig());
      toast.success("ವೈಯಕ್ತಿಕ ಕಾಮಗಾರಿ ಅಪ್ಡೇಟ್ ಆಗಿದೆ");
      dispatch(fetchIndividualByWard(payload.ward));
    } catch {
      dispatch(failure());
      toast.error("Update failed");
    }
  };

// Delete
export const deleteWardIndWork =
  (id: string, wardId: string) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.delete(
        `${API_URL}/wardindwork/${id}`,
        authConfig()
      );
      toast.success("ವೈಯಕ್ತಿಕ ಕಾಮಗಾರಿ ಡಿಲೀಟ್ ಆಗಿದೆ");
      dispatch(fetchIndividualByWard(wardId));
    } catch {
      dispatch(failure());
      toast.error("Delete failed");
    }
  };
