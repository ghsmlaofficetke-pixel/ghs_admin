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

// ✅ ADD THIS (missing earlier)
export interface Statgroup {
  _id?: string;
  name: string;
  taluk: string;
}

// ❌ REMOVE wrong Statdata from here (not needed)

/* =======================
   STATE
======================= */
interface StatgroupState {
  list: Statgroup[];
  current: Statgroup | null;
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
const initialState: StatgroupState = {
  list: [],
  current: null,
  loading: false,
  hasError: false,
};

/* =======================
   SLICE
======================= */
const statgroupSlice = createSlice({
  name: "statgroup",
  initialState,
  reducers: {
    start: (state) => {
      state.loading = true;
      state.hasError = false;
    },

    getAllSuccess: (state, action: PayloadAction<Statgroup[]>) => {
      state.loading = false;
      state.list = action.payload;
    },

    getCurrentSuccess: (state, action: PayloadAction<Statgroup | null>) => {
      state.loading = false;
      state.current = action.payload;
    },

    failure: (state) => {
      state.loading = false;
      state.hasError = true;
    },

    clearStatgroupState: (state) => {
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
  clearStatgroupState,
} = statgroupSlice.actions;

export const statgroupSelector = (state: RootState) => state.statgroup;

export default statgroupSlice.reducer;

/* =======================
   THUNKS
======================= */

// ✅ Fetch ALL
export const fetchAllStatgroup = () => async (dispatch: AppDispatch) => {
  dispatch(start());
  try {
    const res = await axios.get(`${API_URL}/statgroup`, getAuthConfig());
    dispatch(getAllSuccess(res.data.data || res.data));
  } catch (err: any) {
    dispatch(failure());
    toast.error(err?.response?.data?.message || "Failed to load statgroup");
  }
};

// ✅ Fetch by Taluk
export const fetchGroupByTaluk =
  (taluk: string) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      const res = await axios.get(
        `${API_URL}/statgroup/taluk/${taluk}`,
        getAuthConfig()
      );
      dispatch(getAllSuccess(res.data.data || res.data));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "Failed to load statgroup");
    }
  };

// ✅ Fetch single
export const fetchStatgroupById =
  (id: string) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      const res = await axios.get(
        `${API_URL}/statgroup/${id}`,
        getAuthConfig()
      );
      dispatch(getCurrentSuccess(res.data.data || res.data));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "Failed to load statgroup");
    }
  };

// ✅ Create
export const createStatgroup =
  (payload: Statgroup) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.post(`${API_URL}/statgroup`, payload, getAuthConfig());
      toast.success("Statgroup created successfully");

      // refresh
      dispatch(fetchGroupByTaluk(payload.taluk));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "Create failed");
    }
  };

// ✅ Update
export const updateStatgroup =
  (id: string, payload: Statgroup) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.put(`${API_URL}/statgroup/${id}`, payload, getAuthConfig());
      toast.success("Statgroup updated successfully");

      dispatch(fetchGroupByTaluk(payload.taluk));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

// ✅ Delete
export const deleteStatgroup =
  (id: string, taluk: string) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.delete(`${API_URL}/statgroup/${id}`, getAuthConfig());
      toast.success("Statgroup deleted successfully");

      dispatch(fetchGroupByTaluk(taluk));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };