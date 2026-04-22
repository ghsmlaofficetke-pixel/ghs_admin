import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AppDispatch, RootState } from "../redux/store";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export type WorkType = "INDIVIDUAL" | "GROUP";

export interface Work {
  _id?: string;
  villageId: string;
  type: WorkType;
  title_kn: string;
  description_kn: string;
  members?: string[];
}

interface State {
  list: Work[];
  loading: boolean;
}

const getAuthConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

const slice = createSlice({
  name: "work",
  initialState: { list: [], loading: false } as State,
  reducers: {
    start: (s) => {
      s.loading = true;
    },
    success: (s, a: PayloadAction<Work[]>) => {
      s.loading = false;
      s.list = a.payload;
    },
  },
});

export const { start, success } = slice.actions;
export const workSelector = (s: RootState) => s.work;
export default slice.reducer;

/* ================= THUNKS ================= */

export const fetchWorks =
  (villageId: string) => async (dispatch: AppDispatch) => {
    dispatch(start());
    const res = await axios.get(
      `${API_URL}/works?villageId=${villageId}`,
      getAuthConfig()
    );
    dispatch(success(res.data.data));
  };

export const createWork =
  (payload: Work) => async (dispatch: AppDispatch) => {
    dispatch(start());
    await axios.post(`${API_URL}/works`, payload, getAuthConfig());
    toast.success("Work added");
    dispatch(fetchWorks(payload.villageId));
  };
