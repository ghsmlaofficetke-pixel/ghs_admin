import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AppDispatch, RootState } from "../redux/store";
import { toast } from "react-toastify";

/* =======================================================
   GENERIC ELECTION API
   -------------------------------------------------------
   This ONE file replaces the earlier 3 separate files:
     - mlaElectionCandidate.ts
     - mlaElectionPdf.ts
     - mlaElectionSummary.ts

   Every thunk takes an `electionType` ("MLA" | "TP" | "ZP" |
   "PURASABHA") so the exact same code/UI can be reused for
   future elections — no new files needed, just call these
   thunks with a different electionType.
   ======================================================= */

const API_URL = import.meta.env.VITE_API_BASE_URL;

export type ElectionType = "MLA" | "TP" | "ZP" | "PURASABHA";

/* =======================
   Types
======================= */
export interface ElectionCandidate {
  _id?: string;
  party: string;
  candidateName: string;
  candidateImage?: string;
  votes: number;
  isWinner?: boolean;
  remark?: string;
  createdAt?: string;
}

export interface ElectionPdf {
  _id?: string;
  date: string;
  description: string;
  pdfUrl?: string;
  fileName?: string;
  createdAt?: string;
}

export interface PartyVotes {
  congress: number;
  bjp: number;
  jds: number;
  independent: number; // Pakshetara
  others: number;
}

export interface BoothWiseVote {
  slNo?: number;
  boothId?: string;
  partNo: string;
  boothName: string;
  boothArea?: string;
  totalVoters: number;
  takenVotes: PartyVotes;
  votesPolled?: number; // auto-computed sum of takenVotes.* (read-only)
  description?: string;
}

export const EMPTY_PARTY_VOTES: PartyVotes = {
  congress: 0,
  bjp: 0,
  jds: 0,
  independent: 0,
  others: 0,
};

export interface CasteWiseVote {
  caste: string;
  votes: number;
}

export interface ElectionSummary {
  winnerName?: string;
  winnerParty?: string;
  leadVotes?: number;
  tarikereVotes?: number;
  ajjampuraVotes?: number;
  totalVotes?: number;
  boothWiseVotes?: BoothWiseVote[]; 
  casteWiseVotes?: CasteWiseVote[];
  remark?: string;
}

interface ElectionState {
  candidates: ElectionCandidate[];
  pdfs: ElectionPdf[];
  summary: ElectionSummary | null;
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

const base = (electionType: ElectionType, year: string) =>
  `${API_URL}/elections/${electionType}/${year}`;

/* =======================
   Initial State
======================= */
const initialState: ElectionState = {
  candidates: [],
  pdfs: [],
  summary: null,
  loading: false,
  hasError: false,
};

/* =======================
   Slice
======================= */
const electionSlice = createSlice({
  name: "election",
  initialState,
  reducers: {
    start: (state) => {
      state.loading = true;
      state.hasError = false;
    },
    getCandidatesSuccess: (
      state,
      action: PayloadAction<ElectionCandidate[]>
    ) => {
      state.loading = false;
      state.candidates = action.payload;
    },
    getPdfsSuccess: (state, action: PayloadAction<ElectionPdf[]>) => {
      state.loading = false;
      state.pdfs = action.payload;
    },
    getSummarySuccess: (
      state,
      action: PayloadAction<ElectionSummary | null>
    ) => {
      state.loading = false;
      state.summary = action.payload;
    },
    failure: (state) => {
      state.loading = false;
      state.hasError = true;
    },
    clearState: (state) => {
      state.candidates = [];
      state.pdfs = [];
      state.summary = null;
      state.loading = false;
      state.hasError = false;
    },
  },
});

export const {
  start,
  getCandidatesSuccess,
  getPdfsSuccess,
  getSummarySuccess,
  failure,
  clearState,
} = electionSlice.actions;

export const electionSelector = (state: RootState) =>
  (state as any).election as ElectionState;

export default electionSlice.reducer;

/* =======================================================
   THUNKS — CANDIDATES
   ======================================================= */
export const fetchElectionCandidates =
  (electionType: ElectionType, year: string) =>
  async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      const res = await axios.get(
        `${base(electionType, year)}/candidates`,
        getAuthConfig()
      );
      dispatch(getCandidatesSuccess(res.data.data || []));
    } catch (err: any) {
      dispatch(failure());
      toast.error(
        err?.response?.data?.message || "ಅಭ್ಯರ್ಥಿಗಳ ಪಟ್ಟಿ ಲೋಡ್ ಆಗಲಿಲ್ಲ"
      );
    }
  };

export const createElectionCandidate =
  (electionType: ElectionType, year: string, payload: Partial<ElectionCandidate>) =>
  async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      const res = await axios.post(
        `${base(electionType, year)}/candidates`,
        payload,
        getAuthConfig()
      );
      toast.success("ಅಭ್ಯರ್ಥಿ ಸೇರಿಸಲಾಗಿದೆ");
      dispatch(fetchElectionCandidates(electionType, year));
      return res.data;
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "ಸೇರಿಸಲು ವಿಫಲವಾಗಿದೆ");
      throw err;
    }
  };

export const updateElectionCandidate =
  (
    electionType: ElectionType,
    year: string,
    id: string,
    payload: Partial<ElectionCandidate>
  ) =>
  async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      const res = await axios.put(
        `${base(electionType, year)}/candidates/${id}`,
        payload,
        getAuthConfig()
      );
      toast.success("ಅಭ್ಯರ್ಥಿ ಮಾಹಿತಿ ನವೀಕರಿಸಲಾಗಿದೆ");
      dispatch(fetchElectionCandidates(electionType, year));
      return res.data;
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "ನವೀಕರಣ ವಿಫಲವಾಗಿದೆ");
      throw err;
    }
  };

export const deleteElectionCandidate =
  (electionType: ElectionType, year: string, id: string) =>
  async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.delete(
        `${base(electionType, year)}/candidates/${id}`,
        getAuthConfig()
      );
      toast.success("ಅಭ್ಯರ್ಥಿ ಅಳಿಸಲಾಗಿದೆ");
      dispatch(fetchElectionCandidates(electionType, year));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "ಅಳಿಸಲು ವಿಫಲವಾಗಿದೆ");
    }
  };

/* =======================================================
   THUNKS — PDFs
   ======================================================= */
export const fetchElectionPdfs =
  (electionType: ElectionType, year: string) =>
  async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      const res = await axios.get(
        `${base(electionType, year)}/pdfs`,
        getAuthConfig()
      );
      dispatch(getPdfsSuccess(res.data.data || []));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "PDF ಪಟ್ಟಿ ಲೋಡ್ ಆಗಲಿಲ್ಲ");
    }
  };

export const createElectionPdf =
  (electionType: ElectionType, year: string, payload: Partial<ElectionPdf>) =>
  async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      const res = await axios.post(
        `${base(electionType, year)}/pdfs`,
        payload,
        getAuthConfig()
      );
      toast.success("PDF ಅಪ್ಲೋಡ್ ಆಗಿದೆ");
      dispatch(fetchElectionPdfs(electionType, year));
      return res.data;
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "ಅಪ್ಲೋಡ್ ವಿಫಲವಾಗಿದೆ");
      throw err;
    }
  };

export const updateElectionPdf =
  (
    electionType: ElectionType,
    year: string,
    id: string,
    payload: Partial<ElectionPdf>
  ) =>
  async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      const res = await axios.put(
        `${base(electionType, year)}/pdfs/${id}`,
        payload,
        getAuthConfig()
      );
      toast.success("PDF ನವೀಕರಿಸಲಾಗಿದೆ");
      dispatch(fetchElectionPdfs(electionType, year));
      return res.data;
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "ನವೀಕರಣ ವಿಫಲವಾಗಿದೆ");
      throw err;
    }
  };

export const deleteElectionPdf =
  (electionType: ElectionType, year: string, id: string) =>
  async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      await axios.delete(
        `${base(electionType, year)}/pdfs/${id}`,
        getAuthConfig()
      );
      toast.success("PDF ಅಳಿಸಲಾಗಿದೆ");
      dispatch(fetchElectionPdfs(electionType, year));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "ಅಳಿಸಲು ವಿಫಲವಾಗಿದೆ");
    }
  };

/* =======================================================
   THUNKS — SUMMARY
   ======================================================= */
export const fetchElectionSummary =
  (electionType: ElectionType, year: string) =>
  async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      const res = await axios.get(
        `${base(electionType, year)}/summary`,
        getAuthConfig()
      );
      dispatch(getSummarySuccess(res.data.data || null));
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "ಸಾರಾಂಶ ಲೋಡ್ ಆಗಲಿಲ್ಲ");
    }
  };

export const saveElectionSummary =
  (
    electionType: ElectionType,
    year: string,
    payload: Partial<ElectionSummary>
  ) =>
  async (dispatch: AppDispatch) => {
    dispatch(start());
    try {
      const res = await axios.put(
        `${base(electionType, year)}/summary`,
        payload,
        getAuthConfig()
      );
      toast.success("ಸಾರಾಂಶ ಉಳಿಸಲಾಗಿದೆ");
      dispatch(getSummarySuccess(res.data.data || null));
      return res.data;
    } catch (err: any) {
      dispatch(failure());
      toast.error(err?.response?.data?.message || "ಉಳಿಸಲು ವಿಫಲವಾಗಿದೆ");
      throw err;
    }
  };