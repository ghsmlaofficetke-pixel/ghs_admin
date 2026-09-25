import axios from 'axios';
import { toast } from 'react-toastify';

const API = import.meta.env.VITE_API_BASE_URL;
const cfg = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` } });

export interface GSMember {
  serialNo?: number | null;
  name: string;
  phone?: string;
  caste?: string;
  address?: string;
}

export interface GaurantiSamiti {
  _id?: string;
  name: string;
  taluk: 'tarikere' | 'ajjampura';
  areaType: 'gramapanchayath' | 'purasabha' | 'patana';
  gpId?: string | null;
  wardId?: string | null;
  wardIds?: string[];
  locationName?: string;
  remark?: string;
  members: GSMember[];
  createdAt?: string;
}

export const fetchGaurantiSamitis = async (params: { taluk?: string; areaType?: string } = {}): Promise<GaurantiSamiti[]> => {
  try {
    const q = new URLSearchParams(params as any).toString();
    const res = await axios.get(`${API}/gauranthi-samiti?${q}`, cfg());
    return res.data.data || [];
  } catch { return []; }
};

export const createGaurantiSamiti = async (data: Omit<GaurantiSamiti, '_id'>): Promise<GaurantiSamiti | null> => {
  try {
    const res = await axios.post(`${API}/gauranthi-samiti`, data, cfg());
    return res.data.data;
  } catch (err: any) {
    toast.error(err?.response?.data?.message || 'ಸಮಿತಿ ಸೇರಿಸಲು ಆಗಲಿಲ್ಲ');
    return null;
  }
};

export const updateGaurantiSamiti = async (id: string, data: Partial<GaurantiSamiti>): Promise<GaurantiSamiti | null> => {
  try {
    const res = await axios.put(`${API}/gauranthi-samiti/${id}`, data, cfg());
    return res.data.data;
  } catch (err: any) {
    toast.error(err?.response?.data?.message || 'Update ಆಗಲಿಲ್ಲ');
    return null;
  }
};

export const deleteGaurantiSamiti = async (id: string): Promise<boolean> => {
  try {
    await axios.delete(`${API}/gauranthi-samiti/${id}`, cfg());
    return true;
  } catch { toast.error('Delete ಆಗಲಿಲ್ಲ'); return false; }
};
