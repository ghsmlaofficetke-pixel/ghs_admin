// redux/wardcomWork.slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AppDispatch, RootState } from "../redux/store";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_BASE_URL;

/* ================= TYPES ================= */
export interface WardComWork {
  _id?: string;
  workDetails: string;
  estimatedAmount: number;
  scheme: string;
  implementationDepartment?: string;
  letterNumber?: string;
  remarks?: string;
  ward: string;
}

interface State {
  list: WardComWork[];
  current?: WardComWork | null;
  loading: boolean;
  hasError: boolean;
}

/* ================= STATE ================= */
const initialState: State = {
  list: [],
  current: null,
  loading: false,
  hasError: false,
};

/* ================= AUTH ================= */
const authConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

/* ================= SLICE ================= */
const slice = createSlice({
  name: "wardcomWork",
  initialState,
  reducers: {
    start: (s) => { s.loading = true; s.hasError = false; },
    getAllSuccess: (s, a: PayloadAction<WardComWork[]>) => {
      s.loading = false; s.list = a.payload;
    },
    getOneSuccess: (s, a: PayloadAction<WardComWork | null>) => {
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

export const wardcomWorkSelector = (s: RootState) => s.wardcomWork;
export default slice.reducer;

/* ================= THUNKS ================= */

export const fetchCommunityByWard =
  (wardId: string) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      const res = await axios.get(
        `${API_URL}/wardcomwork/ward/${wardId}`,
        authConfig()
      );
      dispatch(getAllSuccess(res.data.data || res.data));
    } catch {
      dispatch(failure());
      toast.error("Failed to load Community works");
    }
  };

export const createWardComWork =
  (payload: WardComWork) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.post(`${API_URL}/wardcomwork`, payload, authConfig());
      toast.success("ಸಮುದಾಯ ಕಾಮಗಾರಿ ಸೇರಿಸಲಾಗಿದೆ");
      dispatch(fetchCommunityByWard(payload.ward));
    } catch {
      dispatch(failure());
      toast.error("Create failed");
    }
  };

export const updateWardComWork =
  (id: string, payload: WardComWork) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.put(`${API_URL}/wardcomwork/${id}`, payload, authConfig());
      toast.success("ಸಮುದಾಯ ಕಾಮಗಾರಿ ಅಪ್ಡೇಟ್ ಆಗಿದೆ");
      dispatch(fetchCommunityByWard(payload.ward));
    } catch {
      dispatch(failure());
      toast.error("Update failed");
    }
  };

export const deleteWardComWork =
  (id: string, wardId: string) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.delete(`${API_URL}/wardcomwork/${id}`, authConfig());
      toast.success("ಸಮುದಾಯ ಕಾಮಗಾರಿ ಡಿಲೀಟ್ ಆಗಿದೆ");
      dispatch(fetchCommunityByWard(wardId));
    } catch {
      dispatch(failure());
      toast.error("Delete failed");
    }
  };
