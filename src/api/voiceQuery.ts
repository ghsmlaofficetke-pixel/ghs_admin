// api/voiceQuery.ts
// Simple API helpers — no Redux needed (search page, local state only)

import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthConfig = () => {
  const token =
    sessionStorage.getItem("token") || localStorage.getItem("token");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

/* =======================
   Types
======================= */

export interface ContactPerson {
  name: string;
  phones: string[];
}

export interface VillageResult {
  _id: string;
  name: string;
  contactPersons: ContactPerson[];
  gp?: string;
  hobli?: string;
  taluk?: string;
}

export interface WardResult {
  _id: string;
  name: string;
  contactPersons: ContactPerson[];
  taluk?: string;
}

export interface ManaviItem {
  _id: string;
  work: string;
  type: string;
  caste?: string;
  description?: string;
  status: string;
  village?: string;
  ward?: string;
  createdAt: string;
}

export interface WorkItem {
  _id: string;
  type: string;
  name?: string;
  mobile?: string;
  address?: string;
  scheme?: string;
  orderNumber?: string;
  workDetails?: string;
  estimatedAmount?: string;
  department?: string;
  letterNumber?: string;
  remarks?: string;
  status?: string;
  village?: string;
  ward?: string;
  createdAt: string;
}

export interface GPInfo {
  _id: string;
  name: string;
  hobli?: string;
  taluk?: string;
  pdo: ContactPerson[];
}

export interface NameSearchResult {
  query: string;
  villages: VillageResult[];
  wards: WardResult[];
  manavis: ManaviItem[];
  indWorks: WorkItem[];
  comWorks: WorkItem[];
  wardManavis: ManaviItem[];
  wardIndWorks: WorkItem[];
  wardComWorks: WorkItem[];
}

export interface GPDetailResult {
  gp: GPInfo;
  villages: VillageResult[];
  manavis: ManaviItem[];
  indWorks: WorkItem[];
  comWorks: WorkItem[];
}

export interface GPSuggestion {
  _id: string;
  name: string;
  hobli?: { name: string; _id: string };
  pdo?: ContactPerson[];
}

/* =======================
   API calls
======================= */

// Search villages + wards by name (text or voice transcript)
export const searchByName = async (q: string): Promise<NameSearchResult> => {
  const res = await axios.get(`${API_URL}/voice-query/search`, {
    params: { q },
    ...getAuthConfig(),
  });
  return res.data.data;
};

// Get all data for a specific GP by its _id
export const getGPDetail = async (gpId: string): Promise<GPDetailResult> => {
  const res = await axios.get(
    `${API_URL}/voice-query/gp/${gpId}`,
    getAuthConfig()
  );
  return res.data.data;
};

// Autocomplete GP names
export const searchGPs = async (q: string): Promise<GPSuggestion[]> => {
  const res = await axios.get(`${API_URL}/voice-query/gp-search`, {
    params: { q },
    ...getAuthConfig(),
  });
  return res.data.data || [];
};