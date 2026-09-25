import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AppDispatch, RootState } from "../redux/store";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export type AreaType = "gramapanchayath" | "purasabha" | "patana";
export type TalukType = "tarikere" | "ajjampura";

export interface Sangha {
  _id?: string;
  name: string;
  taluk: TalukType;
  areaType: AreaType;
  gpId?: string | null;
  wardIds?: string[];
  address?: string;
  phone?: string;
  remark?: string;
  createdAt?: string;
}

export interface Member {
  _id?: string;
  sanghaId: string;
  serialNo?: number;
  regNo?: string;
  name: string;
  age?: number | string;
  designation?: string;
  phone?: string;
  caste?: string;
  address?: string;
}

interface SanghaState {
  list: Sangha[];
  members: Member[];
  loading: boolean;
  hasError: boolean;
}

const getAuthConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
});

const initialState: SanghaState = {
  list: [],
  members: [],
  loading: false,
  hasError: false,
};

const sanghaSlice = createSlice({
  name: "sangha",
  initialState,
  reducers: {
    start:             (state) => { state.loading = true; state.hasError = false; },
    getListSuccess:    (state, a: PayloadAction<Sangha[]>) => { state.loading = false; state.list    = a.payload; },
    getMembersSuccess: (state, a: PayloadAction<Member[]>) => { state.loading = false; state.members = a.payload; },
    failure:           (state) => { state.loading = false; state.hasError = true; },
    clearMembers:      (state) => { state.members = []; },
    clearList:         (state) => { state.list = []; },
  },
});

export const { start, getListSuccess, getMembersSuccess, failure, clearMembers, clearList } = sanghaSlice.actions;
export const sanghaSelector = (state: RootState) => (state as any).sangha as SanghaState;
export default sanghaSlice.reducer;

/* ── Sangha Thunks ── */
export const fetchSanghas =
  (params: { taluk?: string; areaType?: string; gpId?: string } = {}) =>
  async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      const q = new URLSearchParams();
      if (params.taluk)    q.set("taluk",    params.taluk);
      if (params.areaType) q.set("areaType", params.areaType);
      if (params.gpId)     q.set("gpId",     params.gpId);
      const res = await axios.get(`${API_URL}/sangha?${q}`, getAuthConfig());
      dispatch(getListSuccess(res.data.data || []));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "ಸಂಘಗಳ ಪಟ್ಟಿ ಲೋಡ್ ಆಗಲಿಲ್ಲ");
    }
  };

export const createSangha =
  (payload: Sangha, refetch: object = {}) =>
  async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.post(`${API_URL}/sangha`, payload, getAuthConfig());
      toast.success("ಸಂಘ ಸೇರಿಸಲಾಗಿದೆ");
      dispatch(fetchSanghas(refetch));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "ಸೇರಿಸಲು ವಿಫಲವಾಗಿದೆ");
      throw err;
    }
  };

export const updateSangha =
  (id: string, payload: Partial<Sangha>, refetch: object = {}) =>
  async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.put(`${API_URL}/sangha/${id}`, payload, getAuthConfig());
      toast.success("ಸಂಘ ನವೀಕರಿಸಲಾಗಿದೆ");
      dispatch(fetchSanghas(refetch));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "ನವೀಕರಣ ವಿಫಲವಾಗಿದೆ");
    }
  };

export const deleteSangha =
  (id: string, refetch: object = {}) =>
  async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.delete(`${API_URL}/sangha/${id}`, getAuthConfig());
      toast.success("ಸಂಘ ಅಳಿಸಲಾಗಿದೆ");
      dispatch(fetchSanghas(refetch));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "ಅಳಿಸಲು ವಿಫಲವಾಗಿದೆ");
    }
  };

/* ── Member Thunks ── */
export const fetchMembers = (sanghaId: string) => async (dispatch: AppDispatch) => {
  dispatch(start());
  try {
    const res = await axios.get(`${API_URL}/members/sangha/${sanghaId}`, getAuthConfig());
    dispatch(getMembersSuccess(res.data.data || []));
  } catch (err: any) {
    dispatch(failure());
    toast.error(err?.response?.data?.message || "ಸದಸ್ಯರ ಪಟ್ಟಿ ಲೋಡ್ ಆಗಲಿಲ್ಲ");
  }
};

export const createMember = (payload: Member) => async (dispatch: AppDispatch) => {
  dispatch(start());
  try {
    await axios.post(`${API_URL}/members`, payload, getAuthConfig());
    toast.success("ಸದಸ್ಯರು ಸೇರಿಸಲಾಗಿದೆ");
    dispatch(fetchMembers(payload.sanghaId));
  } catch (err: any) {
    dispatch(failure());
    toast.error(err?.response?.data?.message || "ಸೇರಿಸಲು ವಿಫಲವಾಗಿದೆ");
  }
};

export const updateMember =
  (id: string, payload: Partial<Member>, sanghaId: string) =>
  async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.put(`${API_URL}/members/${id}`, payload, getAuthConfig());
      toast.success("ಸದಸ್ಯರ ಮಾಹಿತಿ ನವೀಕರಿಸಲಾಗಿದೆ");
      dispatch(fetchMembers(sanghaId));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "ನವೀಕರಣ ವಿಫಲವಾಗಿದೆ");
    }
  };

export const deleteMember = (id: string, sanghaId: string) => async (dispatch: AppDispatch) => {
  dispatch(start());
  try {
    await axios.delete(`${API_URL}/members/${id}`, getAuthConfig());
    toast.success("ಸದಸ್ಯರು ಅಳಿಸಲಾಗಿದೆ");
    dispatch(fetchMembers(sanghaId));
  } catch (err: any) {
    dispatch(failure());
    toast.error(err?.response?.data?.message || "ಅಳಿಸಲು ವಿಫಲವಾಗಿದೆ");
  }
};
