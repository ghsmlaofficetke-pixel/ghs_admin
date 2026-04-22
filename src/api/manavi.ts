
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
export interface Manavi {
  _id?: string;
  date?: string;
  work: string;
  description?: string;
  refer?: string;
  type?: string;
  village: string;
}

interface ConsolidatedData {
  total: number;
  patanaWise: any[];
  hobliWise: any[];
  gpWise: any[];
  villageWise: any[];
  list: Manavi[];
}

interface ManaviState {
  list: Manavi[];
  consolidated: ConsolidatedData | null;
  current?: Manavi | null;
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
const initialState: ManaviState = {
  list: [],
  consolidated: null,
  current: null,
  loading: false,
  hasError: false,
};

/* =======================
   Slice
======================= */
const manaviSlice = createSlice({
  name: "manavi",
  initialState,
  reducers: {
    start: (state) => {
      state.loading = true;
      state.hasError = false;
    },

    /* 🔹 GET ALL */
    getAllSuccess: (state, action: PayloadAction<Manavi[]>) => {
      state.loading = false;
      state.list = action.payload;
    },

    /* 🔹 CONSOLIDATED */
    getConsolidatedSuccess: (
      state,
      action: PayloadAction<ConsolidatedData>
    ) => {
      state.loading = false;
      state.consolidated = action.payload;
    },

    /* 🔹 SINGLE */
    getCurrentSuccess: (state, action: PayloadAction<Manavi | null>) => {
      state.loading = false;
      state.current = action.payload;
    },

    /* 🔹 ERROR */
    failure: (state) => {
      state.loading = false;
      state.hasError = true;
    },
  },
});

/* =======================
   Exports
======================= */
export const {
  start,
  getAllSuccess,
  getCurrentSuccess,
  getConsolidatedSuccess,
  failure,
} = manaviSlice.actions;

export const manaviSelector = (state: RootState) => state.manavi;

export default manaviSlice.reducer;

/* =======================
   THUNKS
======================= */

/* 🔹 Fetch by Village */
export const fetchManaviByVillage =
  (villageId: string) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      const res = await axios.get(
        `${API_URL}/manavi/village/${villageId}`,
        getAuthConfig()
      );
      dispatch(getAllSuccess(res.data.data || res.data));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "Failed to load Manavi");
    }
  };

/* 🔹 Fetch by ID */
export const fetchManaviById =
  (id: string) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      const res = await axios.get(
        `${API_URL}/manavi/${id}`,
        getAuthConfig()
      );
      dispatch(getCurrentSuccess(res.data.data || res.data));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "Failed to load Manavi");
    }
  };

/* 🔹 Create */
export const createManavi =
  (payload: Manavi) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.post(`${API_URL}/manavi`, payload, getAuthConfig());
      toast.success("ಮನವಿ ಸೇರಿಸಲಾಗಿದೆ");

      dispatch(fetchManaviByVillage(payload.village));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "Create failed");
    }
  };

/* 🔹 Update */
export const updateManavi =
  (id: string, payload: Manavi) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.put(
        `${API_URL}/manavi/${id}`,
        payload,
        getAuthConfig()
      );
      toast.success("ಮನವಿ ಅಪ್ಡೇಟ್ ಆಗಿದೆ");

      dispatch(fetchManaviByVillage(payload.village));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

/* 🔹 Delete */
export const deleteManavi =
  (id: string, villageId: string) =>
  async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.delete(
        `${API_URL}/manavi/${id}`,
        getAuthConfig()
      );
      toast.success("ಮನವಿ ಡಿಲೀಟ್ ಆಗಿದೆ");

      dispatch(fetchManaviByVillage(villageId));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

/* 🔥🔥🔥 MAIN CONSOLIDATED API */
export const fetchConsolidatedManavi =
  (filters: {
    type?: string;
    work?: string;
    patana?: string;
    hobli?: string;
    gp?: string;
    village?: string;
    source?: string; // 🔥 NEW
  }) =>
  async (dispatch: AppDispatch) => {

    dispatch(start());

    try {
      const query = new URLSearchParams();

      if (filters.type?.trim()) {
        query.append("type", filters.type.trim());
      }

      if (filters.work?.trim()) {
        query.append("work", filters.work.trim());
      }

      if (filters.patana?.trim()) {
        query.append("patana", filters.patana);
      }

      if (filters.hobli?.trim()) {
        query.append("hobli", filters.hobli);
      }

      if (filters.gp?.trim()) {
        query.append("gp", filters.gp);
      }

      if (filters.village?.trim()) {
        query.append("village", filters.village);
      }

      // 🔥 NEW SOURCE FILTER
      if (filters.source?.trim()) {
        query.append("source", filters.source);
      }

      const url = `${API_URL}/manavi/consolidated?${query.toString()}`;

      console.log("🚀 API URL 👉", url);

      const res = await axios.get(url, getAuthConfig());

      console.log("✅ RESPONSE 👉", res.data);

      dispatch(getConsolidatedSuccess(res.data));

    } catch (err: any) {
      console.error("❌ API ERROR 👉", err);

      dispatch(failure());
      toast.error(err?.response?.data?.message || "Failed to load data");
    }
  };