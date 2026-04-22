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
export interface Village {
  _id?: string;
  name: string;
  gpId: string;
}

interface VillageState {
  list: Village[];
    searchList: Village[];
  current: Village | null;
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
const initialState: VillageState = {
  list: [],
  searchList: [],   // ✅ correct
  current: null,
  loading: false,
  hasError: false,
};

/* =======================
   Slice
======================= */
const villageSlice = createSlice({
  name: "village",
  initialState,
  reducers: {
    start: (state) => {
      state.loading = true;
      state.hasError = false;
    },
    getAllSuccess: (state, action: PayloadAction<Village[]>) => {
      state.loading = false;
      state.list = action.payload;
    },
    getCurrentSuccess: (state, action: PayloadAction<Village | null>) => {
      state.loading = false;
      state.current = action.payload;
    },
    failure: (state) => {
      state.loading = false;
      state.hasError = true;
    },

    setSearchResults: (state, action: PayloadAction<Village[]>) => {
  state.loading = false;
  state.searchList = action.payload;
},

    clearVillageState: (state) => {
  state.list = [];
  state.searchList = []; 
  state.current = null;
  state.loading = false;
  state.hasError = false;
},
  },
});

export const {start,getAllSuccess,getCurrentSuccess,failure,clearVillageState,setSearchResults,} = villageSlice.actions;

export const villageSelector = (state: RootState) => state.village;
export default villageSlice.reducer;

/* =======================
   Thunks
======================= */

// Fetch ALL villages
export const fetchAllVillages = () => async (dispatch: AppDispatch) => {
  dispatch(start());
  try {
    const res = await axios.get(`${API_URL}/villages`, getAuthConfig());
    dispatch(getAllSuccess(res.data.data || res.data));
  } catch (err: any) {
    dispatch(failure());
    toast.error(err?.response?.data?.message || "Failed to load villages");
  }
};

// Fetch villages by GP
export const fetchGPVillages =
  (gpId: string) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      const res = await axios.get(
        `${API_URL}/villages/gp/${gpId}`,
        getAuthConfig()
      );
      dispatch(getAllSuccess(res.data.data || res.data));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "Failed to load villages");
    }
  };

// Fetch single village
export const fetchVillageById =
  (id: string) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      const res = await axios.get(
        `${API_URL}/villages/${id}`,
        getAuthConfig()
      );
      dispatch(getCurrentSuccess(res.data.data || res.data));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "Failed to load village");
    }
  };

// Create village
export const createVillage =
  (payload: Village) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.post(`${API_URL}/villages`, payload, getAuthConfig());
      toast.success("Village created successfully");

      // ✅ Refresh GP villages list
      dispatch(fetchGPVillages(payload.gpId));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "Create failed");
    }
  };



export const searchVillages =
  (patanaId: string, search: string) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      const res = await axios.get(
        `${API_URL}/villages/search`,
        {
          params: { patanaId, search },
          ...getAuthConfig(),
        }
      );

      dispatch(setSearchResults(res.data.data || res.data));
    } catch (err: any) {
      dispatch(failure());
      console.error("Search API Error:", err);
    }
  };

// Update village
export const updateVillage =
  (id: string, payload: Village) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.put(`${API_URL}/villages/${id}`,payload,getAuthConfig());
      toast.success("Village updated successfully");
      // ✅ Refresh GP villages list
      dispatch(fetchGPVillages(payload.gpId));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

// Delete village
export const deleteVillage =
  (id: string, gpId: string) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {await axios.delete(`${API_URL}/villages/${id}`,getAuthConfig());
      toast.success("Village deleted successfully");
      // ✅ Refresh GP villages list
      dispatch(fetchGPVillages(gpId));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };
