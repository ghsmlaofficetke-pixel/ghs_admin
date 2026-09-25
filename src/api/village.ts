// src/api/village.ts  â€” UPDATED (replace existing file)
// âœ… NEW FIELDS: totalHouses, casteDetails, totalVoters added to Village type
// âœ… NEW thunk: fetchVillageSummary
// âœ… All existing thunks preserved unchanged

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { AppDispatch, RootState } from '../redux/store';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_BASE_URL;

/* â”€â”€â”€ Types â”€â”€â”€ */
export interface CasteDetail {
  casteName: string;
  houseCount: number;
  population?: number; 
}

export interface Village {
  _id?: string;
  name: string;
  gpId?: string;
  gramPanchayati?: string | { _id: string; name_kn?: string; name_en?: string };
  contactPersons?: { name: string; phones: string[] }[];
  // NEW demographic fields
  totalHouses?: number;
  casteDetails?: CasteDetail[];
  population?: number; 
  totalVoters?: number;
}

export interface VillageSummary {
  _id: string;
  name: string;
  totalHouses: number;
  casteDetails: CasteDetail[];
  population?: number; 
  totalVoters: number;
  gramPanchayati?: { _id: string; name_kn?: string; name_en?: string };
}

interface VillageState {
  list: Village[];
  searchList: Village[];
  current: Village | null;
  summary: VillageSummary | null;
  loading: boolean;
  hasError: boolean;
}

/* â”€â”€â”€ Auth helper â”€â”€â”€ */
const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: token ? `Bearer ${token}` : '' } };
};

/* â”€â”€â”€ Initial state â”€â”€â”€ */
const initialState: VillageState = {
  list: [],
  searchList: [],
  current: null,
  summary: null,
  loading: false,
  hasError: false,
};

/* â”€â”€â”€ Slice â”€â”€â”€ */
const villageSlice = createSlice({
  name: 'village',
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
    getSummarySuccess: (state, action: PayloadAction<VillageSummary | null>) => {
      state.loading = false;
      state.summary = action.payload;
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
      state.summary = null;
      state.loading = false;
      state.hasError = false;
    },
  },
});

export const {
  start,
  getAllSuccess,
  getCurrentSuccess,
  getSummarySuccess,
  failure,
  clearVillageState,
  setSearchResults,
} = villageSlice.actions;

export const villageSelector = (state: RootState) => state.village;
export default villageSlice.reducer;

/* â”€â”€â”€ Thunks â”€â”€â”€ */

export const fetchAllVillages = () => async (dispatch: AppDispatch) => {
  dispatch(start());
  try {
    const res = await axios.get(`${API_URL}/villages`, getAuthConfig());
    dispatch(getAllSuccess(res.data.data || res.data));
  } catch (err: any) {
    dispatch(failure());
    toast.error(err?.response?.data?.message || 'Failed to load villages');
  }
};

export const fetchGPVillages = (gpId: string) => async (dispatch: AppDispatch) => {
  dispatch(start());
  try {
    const res = await axios.get(`${API_URL}/villages/gp/${gpId}`, getAuthConfig());
    dispatch(getAllSuccess(res.data.data || res.data));
  } catch (err: any) {
    dispatch(failure());
    toast.error(err?.response?.data?.message || 'Failed to load villages');
  }
};

export const fetchVillageById = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(start());
  try {
    const res = await axios.get(`${API_URL}/villages/${id}`, getAuthConfig());
    dispatch(getCurrentSuccess(res.data.data || res.data));
  } catch (err: any) {
    dispatch(failure());
    toast.error(err?.response?.data?.message || 'Failed to load village');
  }
};

/* â”€â”€ NEW: fetch summary (houses, castes, voters) â”€â”€ */
export const fetchVillageSummary = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(start());
  try {
    const res = await axios.get(`${API_URL}/villages/${id}/summary`, getAuthConfig());
    dispatch(getSummarySuccess(res.data.data || res.data));
  } catch (err: any) {
    dispatch(failure());
    toast.error(err?.response?.data?.message || 'Failed to load village summary');
  }
};

export const createVillage = (payload: Village) => async (dispatch: AppDispatch) => {
  dispatch(start());
  try {
    await axios.post(`${API_URL}/villages`, payload, getAuthConfig());
    toast.success('à²—à³à²°à²¾à²® à²¯à²¶à²¸à³à²µà²¿à²¯à²¾à²—à²¿ à²¸à³‡à²°à²¿à²¸à²²à²¾à²—à²¿à²¦à³† âœ…');
    dispatch(fetchAllVillages());
  } catch (err: any) {
    dispatch(failure());
    toast.error(err?.response?.data?.error || err?.response?.data?.message || 'Create failed');
  }
};

export const searchVillages =
  (patanaId: string, search: string) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      const res = await axios.get(`${API_URL}/villages/search`, {
        params: { patanaId, search },
        ...getAuthConfig(),
      });
      dispatch(setSearchResults(res.data.data || res.data));
    } catch (err: any) {
      dispatch(failure());
      console.error('Search API Error:', err);
    }
  };


export const updateVillage =
  (id: string, payload: Village, gpId?: string) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.put(`${API_URL}/villages/${id}`, payload, getAuthConfig());
      toast.success('Village updated');
      if (gpId) dispatch(fetchGPVillages(gpId));
      // gpId ಇಲ್ಲದಿದ್ದರೆ ಅದು search context ಆಗಿರುತ್ತದೆ — frontend ಅಲ್ಲೇ update ಆಗಿದೆ, ಎನು fetch ಬೇಡ
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.error || 'Update failed');
    }
  };

export const deleteVillage =
  (id: string, gpId: string) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.delete(`${API_URL}/villages/${id}`, getAuthConfig());
      toast.success('Village deleted successfully âœ…');
      dispatch(fetchGPVillages(gpId));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.error || 'Delete failed');
    }
  };
