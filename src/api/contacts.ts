// src/api/contacts.ts
// ✅ UPDATED: Clean API — no backend download calls (frontend handles PDF/Excel)
// All download is done in the component using xlsx + html2pdf
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AppDispatch, RootState } from "../redux/store";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: token ? `Bearer ${token}` : "" } };
};

/* ==================== Types ==================== */

export interface ContactPerson {
  name: string;
  phones: string[];
}

export interface VillageContact {
  _id: string;
  name: string;
  contactPersons: ContactPerson[];
  gp?: { _id: string; name: string };
  hobli?: { _id: string; name: string };
}

export interface GPContacts {
  gp: {
    _id: string;
    name: string;
    hobli?: { _id: string; name: string };
    // NOTE: pdoContacts intentionally not included (per requirement 7)
  };
  villages: { _id: string; name: string; contactPersons: ContactPerson[] }[];
}

export interface GPSummary {
  _id: string;
  name: string;
  hobli?: { _id: string; name: string };
  villageCount: number;
  totalContactCount: number;
  villages: { _id: string; name: string; contactCount: number }[];
}

interface ContactsState {
  gpContacts: GPContacts | null;
  villageContacts: VillageContact | null;
  searchResults: VillageContact[];
  gpSummaryList: GPSummary[];
  loading: boolean;
  hasError: boolean;
}

/* ==================== Slice ==================== */

const initialState: ContactsState = {
  gpContacts: null,
  villageContacts: null,
  searchResults: [],
  gpSummaryList: [],
  loading: false,
  hasError: false,
};

const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    start: (state) => { state.loading = true; state.hasError = false; },
    setGPContacts: (state, action: PayloadAction<GPContacts>) => {
      state.loading = false;
      state.gpContacts = action.payload;
    },
    setVillageContacts: (state, action: PayloadAction<VillageContact>) => {
      state.loading = false;
      state.villageContacts = action.payload;
    },
    setSearchResults: (state, action: PayloadAction<VillageContact[]>) => {
      state.loading = false;
      state.searchResults = action.payload;
    },
    setGPSummaryList: (state, action: PayloadAction<GPSummary[]>) => {
      state.loading = false;
      state.gpSummaryList = action.payload;
    },
    failure: (state) => { state.loading = false; state.hasError = true; },
    clearContacts: (state) => {
      state.gpContacts = null;
      state.villageContacts = null;
      state.searchResults = [];
    },
  },
});

export const {
  start, setGPContacts, setVillageContacts, setSearchResults,
  setGPSummaryList, failure, clearContacts
} = contactsSlice.actions;

export const contactsSelector = (state: RootState) => state.contacts;
export default contactsSlice.reducer;

/* ==================== Thunks ==================== */

export const fetchGPContactSummary =
  (hobliId?: string) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      const url = `${API_URL}/contacts/all-gps${hobliId ? `?hobliId=${hobliId}` : ""}`;
      const res = await axios.get(url, getAuthConfig());
      dispatch(setGPSummaryList(res.data.data));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.error || "Failed to load contacts");
    }
  };

export const fetchGPContacts =
  (gpId: string) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      const res = await axios.get(`${API_URL}/contacts/gp/${gpId}`, getAuthConfig());
      dispatch(setGPContacts(res.data.data));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.error || "Failed to load GP contacts");
    }
  };

export const fetchVillageContacts =
  (villageId: string) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      const res = await axios.get(`${API_URL}/contacts/village/${villageId}`, getAuthConfig());
      dispatch(setVillageContacts(res.data.data.village));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.error || "Failed to load village contacts");
    }
  };

export const searchContacts =
  (q: string, gpId?: string, hobliId?: string) => async (dispatch: AppDispatch) => {
    if (!q || q.trim().length < 2) {
      dispatch(setSearchResults([]));
      return;
    }
    dispatch(start());
    try {
      const params = new URLSearchParams({ q });
      if (gpId) params.append("gpId", gpId);
      if (hobliId) params.append("hobliId", hobliId);
      const res = await axios.get(`${API_URL}/contacts/search?${params}`, getAuthConfig());
      dispatch(setSearchResults(res.data.data));
    } catch {
      dispatch(failure());
    }
  };