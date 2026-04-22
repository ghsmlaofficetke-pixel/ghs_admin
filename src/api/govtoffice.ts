import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AppDispatch, RootState } from "../redux/store";
import { toast } from "react-toastify";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/govtoffice`;

export interface ContactPerson {
  name: string;
  designation: string;
  phones: string[];
}

export interface GovtOffice {
  _id?: string;
  office_name: string;
  panchayatipatana: string;
  office_contact: ContactPerson[];
}

interface GovtOfficeState {
  list: GovtOffice[];
  current: GovtOffice | null;
  loading: boolean;
  hasError: boolean;
}

const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

const initialState: GovtOfficeState = {
  list: [],
  current: null,
  loading: false,
  hasError: false,
};

const govtofficeSlice = createSlice({
  name: "govtoffice",
  initialState,
  reducers: {
    start: (state) => {
      state.loading = true;
      state.hasError = false;
    },
    getAllSuccess: (state, action: PayloadAction<GovtOffice[]>) => {
      state.loading = false;
      state.list = action.payload;
    },
    getCurrentSuccess: (
      state,
      action: PayloadAction<GovtOffice | null>
    ) => {
      state.loading = false;
      state.current = action.payload;
    },
    failure: (state) => {
      state.loading = false;
      state.hasError = true;
    },
  },
});

export const {
  start,
  getAllSuccess,
  getCurrentSuccess,
  failure,
} = govtofficeSlice.actions;

export const govtofficeSelector = (state: RootState) => state.govtoffice;
export default govtofficeSlice.reducer;

/* ======================= THUNKS ======================= */

// GET BY PANCHAYAT
export const fetchPanchaythPatanaGovtOffices =
  (panchayatId: string) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      const res = await axios.get(
        `${API_URL}/panchayat/${panchayatId}`,
        getAuthConfig()
      );
      dispatch(getAllSuccess(res.data.data));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "Load failed");
    }
  };

// CREATE
export const createGovtOffice =
  (payload: GovtOffice) => async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.post(API_URL, payload, getAuthConfig());
      toast.success("Created successfully");
      dispatch(fetchPanchaythPatanaGovtOffices(payload.panchayatipatana));
    } catch (err: any) {
      dispatch(failure());
      toast.error("Create failed");
    }
  };

// UPDATE
export const updateGovtOffice =
  (id: string, payload: GovtOffice) =>
  async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.put(`${API_URL}/${id}`, payload, getAuthConfig());
      toast.success("Updated successfully");
      dispatch(fetchPanchaythPatanaGovtOffices(payload.panchayatipatana));
    } catch (err: any) {
      dispatch(failure());
      toast.error("Update failed");
    }
  };

// DELETE ✅ FIXED
export const deleteGovtOffice =
  (id: string, panchayatId: string) =>
  async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.delete(`${API_URL}/${id}`, getAuthConfig());
      toast.success("Deleted successfully");
      dispatch(fetchPanchaythPatanaGovtOffices(panchayatId));
    } catch (err: any) {
      dispatch(failure());
      toast.error("Delete failed");
    }
  };