import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { AppDispatch, RootState } from "../redux/store";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export interface Block {
  _id?: string;
  name: string; // Kannada allowed
}

interface BlockState {
  blocks: Block[];
  loading: boolean;
  error: boolean;
}

const initialState: BlockState = {
  blocks: [],
  loading: false,
  error: false,
};

const getAuthConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

const blockSlice = createSlice({
  name: "block",
  initialState,
  reducers: {
    start: (state) => {
      state.loading = true;
      state.error = false;
    },
    success: (state, action: PayloadAction<Block[]>) => {
      state.loading = false;
      state.blocks = action.payload;
    },
    failure: (state) => {
      state.loading = false;
      state.error = true;
    },
  },
});

export const { start, success, failure } = blockSlice.actions;
export const blockSelector = (state: RootState) => state.block;
export default blockSlice.reducer;

/* ===== Thunks ===== */

export const fetchBlocks = () => async (dispatch: AppDispatch) => {
  dispatch(start());
  try {
    const res = await axios.get(`${API_URL}/block`, getAuthConfig());
    dispatch(success(res.data));
  } catch {
    dispatch(failure());
    toast.error("Failed to load Block");
  }
};

export const createBlock = (payload: Block) => async (dispatch: AppDispatch) => {
  try {
    await axios.post(`${API_URL}/block`, payload, getAuthConfig());
    toast.success("Block added");
    dispatch(fetchBlocks());
  } catch {
    toast.error("Block creation failed");
  }
};
