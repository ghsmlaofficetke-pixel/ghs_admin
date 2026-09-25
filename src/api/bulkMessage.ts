import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const cfg = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: token ? `Bearer ${token}` : '' } };
};

export interface BulkRecipient { name: string; phone: string; }

export interface BulkSendResult {
  name: string;
  phone: string;
  status: 'sent' | 'failed' | 'pending';
  providerResponse?: string;
}

export interface BulkSendResponse {
  success: boolean;
  message: string;
  logId: string;
  summary: { total: number; sent: number; failed: number };
  results: BulkSendResult[];
}

export interface BulkLog {
  _id: string;
  type: 'voice' | 'whatsapp';
  totalCount: number;
  sentCount: number;
  failedCount: number;
  ttsText?: string;
  audioUrl?: string;
  posterImageUrl?: string;
  caption?: string;
  createdAt: string;
  recipients?: BulkSendResult[];
}

// ── Village-based (existing Contacts page) ──────────────────────────────────
export const sendBulkVoiceCall = async (
  villageIds: string[], audioUrl?: string, ttsText?: string
): Promise<BulkSendResponse | null> => {
  try {
    const res = await axios.post(`${API_URL}/bulk-message/voice`, { villageIds, audioUrl, ttsText }, cfg());
    return res.data;
  } catch (err: any) {
    toast.error(err?.response?.data?.message || 'Voice call send ಆಗಲಿಲ್ಲ');
    return null;
  }
};

export const sendBulkWhatsApp = async (
  villageIds: string[], posterImageUrl: string, caption: string
): Promise<BulkSendResponse | null> => {
  try {
    const res = await axios.post(`${API_URL}/bulk-message/whatsapp`, { villageIds, posterImageUrl, caption }, cfg());
    return res.data;
  } catch (err: any) {
    toast.error(err?.response?.data?.message || 'WhatsApp send ಆಗಲಿಲ್ಲ');
    return null;
  }
};

// ── Direct phone list (Karyakarta Samparka page) ─────────────────────────────
export const sendDirectVoice = async (
  recipients: BulkRecipient[], audioUrl?: string, ttsText?: string
): Promise<BulkSendResponse | null> => {
  try {
    const res = await axios.post(`${API_URL}/bulk-message/direct/voice`, { recipients, audioUrl, ttsText }, cfg());
    return res.data;
  } catch (err: any) {
    toast.error(err?.response?.data?.message || 'Voice call send ಆಗಲಿಲ್ಲ');
    return null;
  }
};

export const sendDirectWhatsApp = async (
  recipients: BulkRecipient[], posterImageUrl: string, caption: string
): Promise<BulkSendResponse | null> => {
  try {
    const res = await axios.post(`${API_URL}/bulk-message/direct/whatsapp`, { recipients, posterImageUrl, caption }, cfg());
    return res.data;
  } catch (err: any) {
    toast.error(err?.response?.data?.message || 'WhatsApp send ಆಗಲಿಲ್ಲ');
    return null;
  }
};

// ── Logs ─────────────────────────────────────────────────────────────────────
export const fetchBulkLogs = async (type?: 'voice' | 'whatsapp', limit = 30): Promise<BulkLog[]> => {
  try {
    const params = new URLSearchParams({ limit: String(limit) });
    if (type) params.set('type', type);
    const res = await axios.get(`${API_URL}/bulk-message/logs?${params}`, cfg());
    return res.data.data || [];
  } catch {
    return [];
  }
};

export const fetchBulkLogDetail = async (id: string): Promise<BulkLog | null> => {
  try {
    const res = await axios.get(`${API_URL}/bulk-message/logs/${id}`, cfg());
    return res.data.data;
  } catch {
    return null;
  }
};
