import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AppDispatch, RootState } from "../redux/store";
import { toast } from "react-toastify";

/* =======================
   API BASE URL
======================= */
const API_URL = import.meta.env.VITE_API_BASE_URL;

/* =======================
   TYPES
======================= */
export interface WorkItem {
  _id?: string;
  type: string;
  status: string;

  name?: string;
  workDetails?: string;

  location?: {
    taluk?: { _id?: string; name?: string };
    hobli?: { _id?: string; name?: string };
    gp?: { _id?: string; name?: string };
    village?: { _id?: string; name?: string };
    ward?: { _id?: string; name?: string };
  };

  createdAt?: string;
}

interface ConsolidatedWorkData {
  data: WorkItem[];
  meta: any;
}

interface WorkState {
  list: WorkItem[];
  consolidated: ConsolidatedWorkData | null;
  current?: WorkItem | null;
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
const initialState: WorkState = {
  list: [],
  consolidated: null,
  current: null,
  loading: false,
  hasError: false,
};

/* =======================
   SLICE
======================= */
const workSlice = createSlice({
  name: "work",
  initialState,
  reducers: {
    start: (state) => {
      state.loading = true;
      state.hasError = false;
    },

    /* 🔹 CONSOLIDATED */
    getConsolidatedSuccess: (
      state,
      action: PayloadAction<ConsolidatedWorkData>
    ) => {
      state.loading = false;
      state.consolidated = action.payload;
      state.list = action.payload.data; // 🔥 table direct use
    },

    /* 🔹 ERROR */
    failure: (state) => {
      state.loading = false;
      state.hasError = true;
    },
  },
});

/* =======================
   EXPORTS
======================= */
export const { start, getConsolidatedSuccess, failure } =
  workSlice.actions;

export const workSelector = (state: RootState) => state.consolidate;

export default workSlice.reducer;

/* =======================
   🔥 CONSOLIDATED API
======================= */
export const fetchConsolidatedWork =
  (filters: {
    type?: string;
    status?: string;
    taluk?: string;
    hobli?: string;
    gp?: string;
    village?: string;
    ward?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) =>
  async (dispatch: AppDispatch) => {
    dispatch(start());

    try {
      const query = new URLSearchParams();

      if (filters.type?.trim()) query.append("type", filters.type);
      if (filters.status?.trim()) query.append("status", filters.status);
      if (filters.taluk) query.append("taluk", filters.taluk);
      if (filters.hobli) query.append("hobli", filters.hobli);
      if (filters.gp) query.append("gp", filters.gp);
      if (filters.village) query.append("village", filters.village);
      if (filters.ward) query.append("ward", filters.ward);
      if (filters.search?.trim()) query.append("search", filters.search);

      if (filters.page) query.append("page", String(filters.page));
      if (filters.limit) query.append("limit", String(filters.limit));

      const url = `${API_URL}/workconsolidation/consolidated?${query.toString()}`;

      console.log("🚀 WORK API 👉", url);

      const res = await axios.get(url, getAuthConfig());

      console.log("✅ WORK RESPONSE 👉", res.data);

      dispatch(
        getConsolidatedSuccess({
          data: res.data?.data || [],
          meta: res.data?.meta || {},
        })
      );

    } catch (err: any) {
      console.error("❌ WORK API ERROR:", err);

      dispatch(failure());

      toast.error(
        err?.response?.data?.message || "Failed to load work data"
      );
    }
  };