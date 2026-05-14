import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { AppDispatch, RootState } from "../redux/store";

/* =======================
   API BASE URL
======================= */
const API_URL = import.meta.env.VITE_API_BASE_URL;

/* =======================
   Types
======================= */
export interface Hobli {
  _id?: string;
  name_en: string;
  name_kn: string;
  blockId: string;
}

interface HobliState {
  all_hobli: Hobli[];
  current_hobli: Hobli | null;
   summary: HobliSummary | null; 
  loading: boolean;
  hasError: boolean;
}

export interface HobliSummary {
  totalGP: number;
  totalVillages: number;
  totalPopulation: number;
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
const initialState: HobliState = {
  all_hobli: [],
  current_hobli: null,
  summary: null,   // ✅ added
  loading: false,
  hasError: false,
};

/* =======================
   Slice
======================= */
const hobliSlice = createSlice({
  name: "hobli",
  initialState,
  reducers: {
    hobliStart: (state) => {
      state.loading = true;
      state.hasError = false;
    },

    getAllHobliSuccess: (state, action: PayloadAction<Hobli[]>) => {
      state.loading = false;
      state.all_hobli = action.payload;
    },

    getCurrentHobliSuccess: (state, action: PayloadAction<Hobli | null>) => {
      state.loading = false;
      state.current_hobli = action.payload;
    },

    getHobliSummarySuccess: (state, action: PayloadAction<HobliSummary>) => {
      state.loading = false;
      state.summary = action.payload;
    },

    hobliFailure: (state) => {
      state.loading = false;
      state.hasError = true;
    },

    clearHobliState: (state) => {
  state.all_hobli = [];
  state.current_hobli = null;
  state.summary = null;
  state.loading = false;
  state.hasError = false;
},
  },
});

export const {hobliStart,getAllHobliSuccess,getCurrentHobliSuccess,hobliFailure, getHobliSummarySuccess,clearHobliState,  } = hobliSlice.actions;

export const hobliSelector = (state: RootState) => state.hobli;
export default hobliSlice.reducer;

/* =======================
   Thunks
======================= */

// Fetch all Hoblis for a Panchayath
export const fetchAllPanchayathHoblis =
  (panchayathId: string) => async (dispatch: AppDispatch) => {
    dispatch(hobliStart());
    try {
      const res = await axios.get(
        `${API_URL}/hoblis/panchayath/${panchayathId}`,
        getAuthConfig()
      );
      dispatch(getAllHobliSuccess(res.data.data || res.data)); // depends on API shape

    } catch (err: any) {
      dispatch(hobliFailure());
      toast.error(
  typeof err?.response?.data?.message === "string"
    ? err.response.data.message
    : "Failed to load Hoblis"
);
    }
  };


  export const fetchAllHoblis = () => async (dispatch: AppDispatch) => {
  dispatch(hobliStart());
  try {
    const res = await axios.get(`${API_URL}/hoblis`,getAuthConfig());

    dispatch(getAllHobliSuccess(res.data.data || res.data));
  } catch (err: any) {
    dispatch(hobliFailure());
    toast.error(
  typeof err?.response?.data?.message === "string"
    ? err.response.data.message
    : "Failed to load Hoblis"
);
  }
};

// Create Hobli
export const createHobli = (payload: Hobli) => async (dispatch: AppDispatch) => {
  dispatch(hobliStart());
  try {
    await axios.post(`${API_URL}/hoblis`, payload, getAuthConfig());
    toast.success("Hobli created");
    // refetch after creation
    dispatch(fetchAllPanchayathHoblis(payload.blockId));
  } catch (err: any) {
    dispatch(hobliFailure());
    toast.error(err?.response?.data?.message || "Create failed");
  }
};

// Update Hobli
export const updateHobli =
  (id: string, payload: Hobli) => async (dispatch: AppDispatch) => {
    dispatch(hobliStart());
    try {
      await axios.put(`${API_URL}/hoblis/${id}`, payload, getAuthConfig());
      toast.success("Hobli updated");
      dispatch(fetchAllPanchayathHoblis(payload.blockId));
    } catch (err: any) {
      dispatch(hobliFailure());
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

// Delete Hobli
export const deleteHobli =
  (id: string, blockId: string) => async (dispatch: AppDispatch) => {
    dispatch(hobliStart());
    try {
      await axios.delete(`${API_URL}/hoblis/${id}`, getAuthConfig());
      toast.success("Hobli deleted");
      dispatch(fetchAllPanchayathHoblis(blockId));
    } catch (err: any) {
      dispatch(hobliFailure());
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };


 export const fetchHobliSummary =
  (hobliId: string) => async (dispatch: AppDispatch) => {
    dispatch(hobliStart());
    try {
      const res = await axios.get(
        `${API_URL}/hoblis/summary/${hobliId}`,
        getAuthConfig()
      );
      dispatch(getHobliSummarySuccess(res.data.data || res.data));

    } catch (err: any) {
      dispatch(hobliFailure());
      toast.error(
        err?.response?.data?.message || "Failed to load Hobli summary"
      );
    }
  };