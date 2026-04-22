import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AppDispatch, RootState } from "../redux/store";
import { toast } from "react-toastify";

/* =======================
   API BASE URL
======================= */
const API_URL = import.meta.env.VITE_API_BASE_URL;

/* =======================
   TYPES (✅ FIXED)
======================= */
export interface Statdata {
  _id?: string;
  title: string;
  value: string;
  taluk: string;
  group: string; // ✅ important
}

interface StatdataState {
  list: Statdata[];
  current: Statdata | null;
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
const initialState: StatdataState = {
  list: [],
  current: null,
  loading: false,
  hasError: false,
};

/* =======================
   SLICE
======================= */
const statdataSlice = createSlice({
  name: "statdata",
  initialState,
  reducers: {
    start: (state) => {
      state.loading = true;
      state.hasError = false;
    },

    getAllSuccess: (state, action: PayloadAction<Statdata[]>) => {
      state.loading = false;
      state.list = action.payload;
    },

    getCurrentSuccess: (state, action: PayloadAction<Statdata | null>) => {
      state.loading = false;
      state.current = action.payload;
    },

    failure: (state) => {
      state.loading = false;
      state.hasError = true;
    },

    clearStatdataState: (state) => {
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
  clearStatdataState,
} = statdataSlice.actions;

export const statdataSelector = (state: RootState) => state.statdata;
export default statdataSlice.reducer;

/* =======================
   THUNKS
======================= */

// ✅ Fetch ALL
export const fetchAllStatdata = () => async (dispatch: AppDispatch) => {
  dispatch(start());
  try {
    const res = await axios.get(`${API_URL}/statdata`, getAuthConfig());
    dispatch(getAllSuccess(res.data.data || res.data));
  } catch (err: any) {
    dispatch(failure());
    toast.error(err?.response?.data?.message || "Failed to load statdata");
  }
};

// ✅ Fetch by Group
export const fetchDataByGroup =
  (group: string) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      const res = await axios.get(
        `${API_URL}/statdata/gp/${group}`,
        getAuthConfig()
      );
      dispatch(getAllSuccess(res.data.data || res.data));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "Failed to load statdata");
    }
  };

// ✅ Fetch single
export const fetchStatdataById =
  (id: string) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      const res = await axios.get(
        `${API_URL}/statdata/${id}`,
        getAuthConfig()
      );
      dispatch(getCurrentSuccess(res.data.data || res.data));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "Failed to load statdata");
    }
  };

// ✅ CREATE (FIXED)
export const createStatdata =
  (payload: Statdata) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      console.log("CREATE PAYLOAD:", payload);

      await axios.post(`${API_URL}/statdata`, payload, getAuthConfig());

      toast.success("Statdata created successfully");

      // ✅ correct refresh
      dispatch(fetchDataByGroup(payload.group));
    } catch (err: any) {
      console.log("CREATE ERROR:", err?.response);
      dispatch(failure());
      toast.error(err?.response?.data?.message || "Create failed");
    }
  };

// ✅ UPDATE (FIXED)
export const updateStatdata =
  (id: string, payload: Statdata) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.put(
        `${API_URL}/statdata/${id}`,
        payload,
        getAuthConfig()
      );

      toast.success("Statdata updated successfully");

      const groupId =
        typeof payload.group === "object"
          ? payload.group._id
          : payload.group;

      dispatch(fetchDataByGroup(groupId));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

// ✅ DELETE
export const deleteStatdata =
  (id: string, group: string) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.delete(`${API_URL}/statdata/${id}`, getAuthConfig());

      toast.success("Statdata deleted successfully");

      dispatch(fetchDataByGroup(group));
    } catch (err: any) {
      console.log("DELETE ERROR:", err?.response);
      dispatch(failure());
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };