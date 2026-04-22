// redux/individualWork.slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AppDispatch, RootState } from "../redux/store";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_BASE_URL;

/* ================= TYPES ================= */
export interface IndividualWork {
  _id?: string;
  name: string;
  address?: string;
  mobile?: string;
  scheme: string;
  orderNumber?: string;
  village: string;
}

interface State {
  list: IndividualWork[];
  current?: IndividualWork | null;
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
  name: "individualWork",
  initialState,
  reducers: {
    start: (s) => { s.loading = true; s.hasError = false; },
    getAllSuccess: (s, a: PayloadAction<IndividualWork[]>) => {
      s.loading = false; s.list = a.payload;
    },
    getOneSuccess: (s, a: PayloadAction<IndividualWork | null>) => {
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

export const individualWorkSelector = (s: RootState) => s.individualWork;
export default slice.reducer;

/* ================= THUNKS ================= */

// By Village
export const fetchIndividualByVillage =
  (villageId: string) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      const res = await axios.get(
        `${API_URL}/indwork/village/${villageId}`,
        authConfig()
      );
      dispatch(getAllSuccess(res.data.data || res.data));
    } catch (e: any) {
      dispatch(failure());
      toast.error("Failed to load Individual works");
    }
  };

// Create
export const createIndividualWork =
  (payload: IndividualWork) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.post(`${API_URL}/indwork`, payload, authConfig());
      toast.success("ವೈಯಕ್ತಿಕ ಕಾಮಗಾರಿ ಸೇರಿಸಲಾಗಿದೆ");
      dispatch(fetchIndividualByVillage(payload.village));
    } catch (e: any) {
      dispatch(failure());
      toast.error("Create failed");
    }
  };

// Update
export const updateIndividualWork =
  (id: string, payload: IndividualWork) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.put(`${API_URL}/indwork/${id}`, payload, authConfig());
      toast.success("ವೈಯಕ್ತಿಕ ಕಾಮಗಾರಿ ಅಪ್ಡೇಟ್ ಆಗಿದೆ");
      dispatch(fetchIndividualByVillage(payload.village));
    } catch {
      dispatch(failure());
      toast.error("Update failed");
    }
  };

// Delete
export const deleteIndividualWork =
  (id: string, villageId: string) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.delete(
        `${API_URL}/indwork/${id}`,
        authConfig()
      );
      toast.success("ವೈಯಕ್ತಿಕ ಕಾಮಗಾರಿ ಡಿಲೀಟ್ ಆಗಿದೆ");
      dispatch(fetchIndividualByVillage(villageId));
    } catch {
      dispatch(failure());
      toast.error("Delete failed");
    }
  };
