import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AppDispatch, RootState } from "../redux/store";
import { toast } from "react-toastify";

/* =======================
   API BASE URL
======================= */
const API_URL = import.meta.env.VITE_API_BASE_URL;

/* =======================
   Types (✅ FIXED)
======================= */
export interface AdhiveshanaPdf {
  _id?: string;
  date: string;
  description: string;
  department: string;
  pdfUrl?: string;
  fileName?: string;
  createdAt?: string;
}

interface AdhiveshanaPdfState {
  list: AdhiveshanaPdf[];
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
const initialState: AdhiveshanaPdfState = {
  list: [],
  loading: false,
  hasError: false,
};

/* =======================
   Slice
======================= */
const adhiveshanaPdfSlice = createSlice({
  name: "adhiveshanaPdf",
  initialState,
  reducers: {
    start: (state) => {
      state.loading = true;
      state.hasError = false;
    },

    getAllSuccess: (state, action: PayloadAction<AdhiveshanaPdf[]>) => {
      state.loading = false;
      state.list = action.payload;
    },

    failure: (state) => {
      state.loading = false;
      state.hasError = true;
    },

    clearPdfState: (state) => {
      state.list = [];
      state.loading = false;
      state.hasError = false;
    },
  },
});

export const {
  start,
  getAllSuccess,
  failure,
  clearPdfState,
} = adhiveshanaPdfSlice.actions;

export const adhiveshanaPdfSelector = (state: RootState) =>
  state.adhiveshanaPdf;

export default adhiveshanaPdfSlice.reducer;

/* =======================
   Thunks
======================= */

// ✅ Get all PDFs
export const fetchAdhiveshanaPdfs =
  () => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      const res = await axios.get(
        `${API_URL}/adpdf`,
        getAuthConfig()
      );

      dispatch(getAllSuccess(res.data.data || res.data));
    } catch (err: any) {
      dispatch(failure());
      toast.error(
        err?.response?.data?.message || "Failed to load PDFs"
      );
    }
  };

// ✅ Create PDF
export const createAdhiveshanaPdf =
  (payload: AdhiveshanaPdf) =>
  async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      const res = await axios.post(
        `${API_URL}/adpdf/upload`,
        payload,
        getAuthConfig()
      );

      toast.success("PDF uploaded successfully");

      dispatch(fetchAdhiveshanaPdfs());

      return res.data;
    } catch (err: any) {
      dispatch(failure());
      toast.error(
        err?.response?.data?.message || "Upload failed"
      );
      throw err;
    }
  };

// ✅ UPDATE PDF (🔥 NEW)
export const updateAdhiveshanaPdf =
  (id: string, payload: Partial<AdhiveshanaPdf>) =>
  async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      const res = await axios.put(
        `${API_URL}/adpdf/${id}`,
        payload,
        getAuthConfig()
      );

      toast.success("PDF updated successfully");

      dispatch(fetchAdhiveshanaPdfs());

      return res.data;
    } catch (err: any) {
      dispatch(failure());
      toast.error(
        err?.response?.data?.message || "Update failed"
      );
      throw err;
    }
  };

// ✅ Delete PDF
export const deleteAdhiveshanaPdf =
  (id: string) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.delete(
        `${API_URL}/adpdf/${id}`,
        getAuthConfig()
      );

      toast.success("PDF deleted successfully");

      dispatch(fetchAdhiveshanaPdfs());
    } catch (err: any) {
      dispatch(failure());
      toast.error(
        err?.response?.data?.message || "Delete failed"
      );
    }
  };