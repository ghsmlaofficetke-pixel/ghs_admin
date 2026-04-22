// redux/communityWork.slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AppDispatch, RootState } from "../redux/store";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_BASE_URL;

/* ================= TYPES ================= */
export interface CommunityWork {
  _id?: string;
  workDetails: string;
  estimatedAmount: number;
  scheme: string;
  implementationDepartment?: string;
  letterNumber?: string;
  remarks?: string;
  village: string;
}

interface State {
  list: CommunityWork[];
  current?: CommunityWork | null;
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
  name: "communityWork",
  initialState,
  reducers: {
    start: (s) => { s.loading = true; s.hasError = false; },
    getAllSuccess: (s, a: PayloadAction<CommunityWork[]>) => {
      s.loading = false; s.list = a.payload;
    },
    getOneSuccess: (s, a: PayloadAction<CommunityWork | null>) => {
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

export const communityWorkSelector = (s: RootState) => s.communityWork;
export default slice.reducer;

/* ================= THUNKS ================= */

export const fetchCommunityByVillage =
  (villageId: string) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      const res = await axios.get(
        `${API_URL}/comwork/village/${villageId}`,
        authConfig()
      );
      dispatch(getAllSuccess(res.data.data || res.data));
    } catch {
      dispatch(failure());
      toast.error("Failed to load Community works");
    }
  };

export const createCommunityWork =
  (payload: CommunityWork) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.post(`${API_URL}/comwork`, payload, authConfig());
      toast.success("ಸಮುದಾಯ ಕಾಮಗಾರಿ ಸೇರಿಸಲಾಗಿದೆ");
      dispatch(fetchCommunityByVillage(payload.village));
    } catch {
      dispatch(failure());
      toast.error("Create failed");
    }
  };

export const updateCommunityWork =
  (id: string, payload: CommunityWork) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.put(`${API_URL}/comwork/${id}`, payload, authConfig());
      toast.success("ಸಮುದಾಯ ಕಾಮಗಾರಿ ಅಪ್ಡೇಟ್ ಆಗಿದೆ");
      dispatch(fetchCommunityByVillage(payload.village));
    } catch {
      dispatch(failure());
      toast.error("Update failed");
    }
  };

export const deleteCommunityWork =
  (id: string, villageId: string) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.delete(`${API_URL}/comwork/${id}`, authConfig());
      toast.success("ಸಮುದಾಯ ಕಾಮಗಾರಿ ಡಿಲೀಟ್ ಆಗಿದೆ");
      dispatch(fetchCommunityByVillage(villageId));
    } catch {
      dispatch(failure());
      toast.error("Delete failed");
    }
  };
