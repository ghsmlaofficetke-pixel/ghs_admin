import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AppDispatch, RootState } from "../redux/store";
import { toast } from "react-toastify";

/* =======================================================
   BOOTH (BLA / BLO List) API
   -------------------------------------------------------
   Master list of polling booths — Part No, Booth Name,
   Booth Area, BLA Name/Mobile, BLO Name/Mobile.
   Used by the "BLA BLO List" screen (full CRUD + Excel
   upload) and by MLA Election Summary to fetch Part No /
   Booth Name / Booth Area instead of re-typing them.
   ======================================================= */

const API_URL = import.meta.env.VITE_API_BASE_URL;

export interface Booth {
  _id?: string;
  partNo: string;
  boothName: string;
  boothArea?: string;
  blaName?: string;
  blaMobile?: string;
  bloName?: string;
  bloMobile?: string;
  createdAt?: string;
}

interface BoothState {
  booths: Booth[];
  loading: boolean;
  hasError: boolean;
}

const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

const base = `${API_URL}/booths`;

const initialState: BoothState = {
  booths: [],
  loading: false,
  hasError: false,
};

const boothSlice = createSlice({
  name: "booth",
  initialState,
  reducers: {
    start: (state) => {
      state.loading = true;
      state.hasError = false;
    },
    getBoothsSuccess: (state, action: PayloadAction<Booth[]>) => {
      state.loading = false;
      state.booths = action.payload;
    },
    failure: (state) => {
      state.loading = false;
      state.hasError = true;
    },
    clearState: (state) => {
      state.booths = [];
      state.loading = false;
      state.hasError = false;
    },
  },
});

export const { start, getBoothsSuccess, failure, clearState } =
  boothSlice.actions;

export const boothSelector = (state: RootState) =>
  (state as any).booth as BoothState;

export default boothSlice.reducer;

/* =======================================================
   THUNKS
   ======================================================= */
export const fetchBooths = () => async (dispatch: AppDispatch) => {
  dispatch(start());
  try {
    const res = await axios.get(base, getAuthConfig());
    dispatch(getBoothsSuccess(res.data.data || []));
  } catch (err: any) {
    dispatch(failure());
    toast.error(err?.response?.data?.message || "Booth ಪಟ್ಟಿ ಲೋಡ್ ಆಗಲಿಲ್ಲ");
  }
};

export const createBooth =
  (payload: Partial<Booth>) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      const res = await axios.post(base, payload, getAuthConfig());
      toast.success("Booth ಸೇರಿಸಲಾಗಿದೆ");
      dispatch(fetchBooths());
      return res.data;
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "ಸೇರಿಸಲು ವಿಫಲವಾಗಿದೆ");
      throw err;
    }
  };

export const updateBooth =
  (id: string, payload: Partial<Booth>) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      const res = await axios.put(`${base}/${id}`, payload, getAuthConfig());
      toast.success("Booth ನವೀಕರಿಸಲಾಗಿದೆ");
      dispatch(fetchBooths());
      return res.data;
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "ನವೀಕರಣ ವಿಫಲವಾಗಿದೆ");
      throw err;
    }
  };

export const deleteBooth = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(start());
  try {
    await axios.delete(`${base}/${id}`, getAuthConfig());
    toast.success("Booth ಅಳಿಸಲಾಗಿದೆ");
    dispatch(fetchBooths());
  } catch (err: any) {
    dispatch(failure());
    toast.error(err?.response?.data?.message || "ಅಳಿಸಲು ವಿಫಲವಾಗಿದೆ");
  }
};

export const bulkImportBooths =
  (rows: Partial<Booth>[], mode: "upsert" | "replace" = "upsert") =>
  async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      const res = await axios.post(
        `${base}/bulk-import`,
        { rows, mode },
        getAuthConfig()
      );
      toast.success(res.data.message || "Excel ಅಪ್ಲೋಡ್ ಯಶಸ್ವಿ");
      dispatch(fetchBooths());
      return res.data;
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "Excel ಅಪ್ಲೋಡ್ ವಿಫಲವಾಗಿದೆ");
      throw err;
    }
  };
