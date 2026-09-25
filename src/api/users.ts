import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } };
};

/* ─── Types ─── */
export interface User {
  _id: string;
  first_name: string;
  last_name: string;
  phone_no: string;
  email: string;
  role: string;
  address?: string;
  isActive: boolean;
  activeSessionDeviceId?: string | null;
  createdAt: string;
}

export interface SessionStats {
  total: number;
  loggedIn: number;
  deactivated: number;
  activeUsers: User[];
}

interface UsersState {
  users: User[];
  stats: SessionStats | null;
  loading: boolean;
  hasError: boolean;
}

/* ─── Thunks ─── */
export const fetchUsers = createAsyncThunk("users/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_URL}/users`, getAuthConfig());
    return res.data?.data || res.data;
  } catch (e: any) {
    return rejectWithValue(e?.response?.data?.message || "Failed to fetch users");
  }
});

export const createUser = createAsyncThunk("users/create", async (data: Partial<User> & { password: string }, { dispatch, rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_URL}/users/register`, data, getAuthConfig());
    console.log(res.data?.data)
    toast.success("User created successfully!");
    dispatch(fetchUsers());
    return res.data?.data;
  } catch (e: any) {
    const msg = e?.response?.data?.message || "Failed to create user";
    toast.error(msg);
    console.log(e)
    return rejectWithValue(msg);
  }
});

export const updateUser = createAsyncThunk("users/update", async ({ id, data }: { id: string; data: Partial<User> }, { dispatch, rejectWithValue }) => {
  try {
    const res = await axios.put(`${API_URL}/users/${id}`, data, getAuthConfig());
    toast.success("User updated!");
    dispatch(fetchUsers());
    return res.data?.data;
  } catch (e: any) {
    const msg = e?.response?.data?.message || "Update failed";
    toast.error(msg);
    return rejectWithValue(msg);
  }
});

export const deleteUser = createAsyncThunk("users/delete", async (id: string, { dispatch, rejectWithValue }) => {
  try {
    await axios.delete(`${API_URL}/users/${id}`, getAuthConfig());
    toast.success("User deleted.");
    dispatch(fetchUsers());
    return id;
  } catch (e: any) {
    const msg = e?.response?.data?.message || "Delete failed";
    toast.error(msg);
    return rejectWithValue(msg);
  }
});

export const toggleUserActive = createAsyncThunk(
  "users/toggleActive",
  async ({ id, isActive }: { id: string; isActive: boolean }, { dispatch, rejectWithValue }) => {
    try {
      await axios.patch(`${API_URL}/users/${id}/toggle-active`, { isActive }, getAuthConfig());
      toast.success(isActive ? "User activated!" : "User deactivated!");
      dispatch(fetchUsers());
      return { id, isActive };
    } catch (e: any) {
      const msg = e?.response?.data?.message || "Action failed";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const fetchSessionStats = createAsyncThunk("users/sessionStats", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_URL}/users/session-stats`, getAuthConfig());
    return res.data?.data || res.data;
  } catch (e: any) {
    return rejectWithValue(e?.response?.data?.message || "Failed to fetch stats");
  }
});

/* ─── Slice ─── */
const usersSlice = createSlice({
  name: "users",
  initialState: { users: [], stats: null, loading: false, hasError: false } as UsersState,
  reducers: {},
  extraReducers: (b) => {
    b
      .addCase(fetchUsers.pending,       (s) => { s.loading = true; s.hasError = false; })
      .addCase(fetchUsers.fulfilled,     (s, a) => { s.loading = false; s.users = a.payload || []; })
      .addCase(fetchUsers.rejected,      (s) => { s.loading = false; s.hasError = true; })
      .addCase(fetchSessionStats.fulfilled, (s, a) => { s.stats = a.payload; });
  },
});

export default usersSlice.reducer;