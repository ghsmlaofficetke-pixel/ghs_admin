import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { AppDispatch, RootState } from '../redux/store';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_BASE_URL;

/* ── Types ── */
export interface YuvaSangha {
  _id?: string;
  name: string;
  taluk: 'tarikere' | 'ajjampura';
  areaType: 'gramapanchayath' | 'purasabha' | 'patana';
  gpId?: string | null;
  patanaId?: string | null;
  wardId?: string | null;
  wardIds?: string[];
  locationName?: string;
  address?: string;
  phone?: string;
  remark?: string;
  createdAt?: string;
}

export interface YuvaMember {
  _id?: string;
  yuvaSanghaId: string;
  serialNo?: number | null;
  regNo?: string;
  name: string;
  age?: number | null;
  designation?: string;
  phone?: string;
  caste?: string;
  address?: string;
}

interface YuvaSanghaState {
  list: YuvaSangha[];
  members: YuvaMember[];
  stats: { byTaluk: any[]; byAreaType: any[] } | null;
  loading: boolean;
  hasError: boolean;
}

const getAuthConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
});

const initialState: YuvaSanghaState = {
  list: [],
  members: [],
  stats: null,
  loading: false,
  hasError: false,
};

const yuvaSanghaSlice = createSlice({
  name: 'yuvaSangha',
  initialState,
  reducers: {
    start:             (state) => { state.loading = true; state.hasError = false; },
    getListSuccess: (state, a: PayloadAction<{ data: YuvaSangha[]; taluk: string; areaType: string }>) => {
      state.loading = false;
      const { data, taluk, areaType } = a.payload;
      const kept = state.list.filter(s => !(s.taluk === taluk && s.areaType === areaType));
      state.list = [...kept, ...data];
    },
    getMembersSuccess: (state, a: PayloadAction<YuvaMember[]>) => { state.loading = false; state.members = a.payload; },
    getStatsSuccess:   (state, a: PayloadAction<any>)          => { state.loading = false; state.stats   = a.payload; },
    failure:           (state) => { state.loading = false; state.hasError = true; },
    clearMembers:      (state) => { state.members = []; },
  },
});

export const { start, getListSuccess, getMembersSuccess, getStatsSuccess, failure, clearMembers } = yuvaSanghaSlice.actions;
export const yuvaSanghaSelector = (state: RootState) => (state as any).yuvaSangha as YuvaSanghaState;
export default yuvaSanghaSlice.reducer;

/* ── YuvaSangha Thunks ── */
export const fetchYuvaSanghas =
  (params: { taluk?: string; areaType?: string; gpId?: string; patanaId?: string; wardId?: string } = {}) =>
  async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      const q = new URLSearchParams();
      if (params.taluk)    q.set('taluk',    params.taluk);
      if (params.areaType) q.set('areaType', params.areaType);
      if (params.gpId)     q.set('gpId',     params.gpId);
      if (params.patanaId) q.set('patanaId', params.patanaId);
      if (params.wardId)   q.set('wardId',   params.wardId);
      const res = await axios.get(`${API_URL}/yuva-sangha?${q}`, getAuthConfig());
      dispatch(getListSuccess({
        data:     res.data.data || [],
        taluk:    params.taluk    || '',
        areaType: params.areaType || '',
      }));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || 'ಯುವ ಸಂಘಗಳ ಪಟ್ಟಿ ಲೋಡ್ ಆಗಲಿಲ್ಲ');
    }
  };

export const fetchYuvaSanghaStats = (taluk?: string) => async (dispatch: AppDispatch) => {
  dispatch(start());
  try {
    const q = taluk ? `?taluk=${taluk}` : '';
    const res = await axios.get(`${API_URL}/yuva-sangha/stats${q}`, getAuthConfig());
    dispatch(getStatsSuccess(res.data.data || null));
  } catch (err: any) {
    dispatch(failure());
  }
};

export const createYuvaSangha = (payload: YuvaSangha, refetch: object = {}) => async (dispatch: AppDispatch) => {
  dispatch(start());
  try {
    await axios.post(`${API_URL}/yuva-sangha`, payload, getAuthConfig());
    toast.success('ಯುವ ಸಂಘ ಸೇರಿಸಲಾಗಿದೆ ✅');
    dispatch(fetchYuvaSanghas(refetch));
  } catch (err: any) {
    dispatch(failure());
    toast.error(err?.response?.data?.message || 'ಸೇರಿಸಲು ವಿಫಲವಾಗಿದೆ');
  }
};

export const updateYuvaSangha =
  (id: string, payload: Partial<YuvaSangha>, refetch: object = {}) =>
  async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.put(`${API_URL}/yuva-sangha/${id}`, payload, getAuthConfig());
      toast.success('ಯುವ ಸಂಘ ನವೀಕರಿಸಲಾಗಿದೆ ✅');
      dispatch(fetchYuvaSanghas(refetch));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || 'ನವೀಕರಣ ವಿಫಲವಾಗಿದೆ');
    }
  };

export const deleteYuvaSangha =
  (id: string, refetch: object = {}) =>
  async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.delete(`${API_URL}/yuva-sangha/${id}`, getAuthConfig());
      toast.success('ಯುವ ಸಂಘ ಅಳಿಸಲಾಗಿದೆ ✅');
      dispatch(fetchYuvaSanghas(refetch));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || 'ಅಳಿಸಲು ವಿಫಲವಾಗಿದೆ');
    }
  };

/* ── YuvaMember Thunks ── */
export const fetchYuvaMembers = (yuvaSanghaId: string) => async (dispatch: AppDispatch) => {
  dispatch(start());
  try {
    const res = await axios.get(`${API_URL}/yuva-members/yuva-sangha/${yuvaSanghaId}`, getAuthConfig());
    dispatch(getMembersSuccess(res.data.data || []));
  } catch (err: any) {
    dispatch(failure());
    toast.error(err?.response?.data?.message || 'ಸದಸ್ಯರ ಪಟ್ಟಿ ಲೋಡ್ ಆಗಲಿಲ್ಲ');
  }
};

export const createYuvaMember = (payload: YuvaMember) => async (dispatch: AppDispatch) => {
  dispatch(start());
  try {
    await axios.post(`${API_URL}/yuva-members`, payload, getAuthConfig());
    toast.success('ಸದಸ್ಯರು ಸೇರಿಸಲಾಗಿದೆ ✅');
    dispatch(fetchYuvaMembers(payload.yuvaSanghaId));
  } catch (err: any) {
    dispatch(failure());
    toast.error(err?.response?.data?.message || 'ಸೇರಿಸಲು ವಿಫಲವಾಗಿದೆ');
  }
};

export const updateYuvaMember =
  (id: string, payload: Partial<YuvaMember>, yuvaSanghaId: string) =>
  async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.put(`${API_URL}/yuva-members/${id}`, payload, getAuthConfig());
      toast.success('ಸದಸ್ಯರ ಮಾಹಿತಿ ನವೀಕರಿಸಲಾಗಿದೆ ✅');
      dispatch(fetchYuvaMembers(yuvaSanghaId));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || 'ನವೀಕರಣ ವಿಫಲವಾಗಿದೆ');
    }
  };

export const deleteYuvaMember =
  (id: string, yuvaSanghaId: string) =>
  async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.delete(`${API_URL}/yuva-members/${id}`, getAuthConfig());
      toast.success('ಸದಸ್ಯರು ಅಳಿಸಲಾಗಿದೆ ✅');
      dispatch(fetchYuvaMembers(yuvaSanghaId));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || 'ಅಳಿಸಲು ವಿಫಲವಾಗಿದೆ');
    }
  };