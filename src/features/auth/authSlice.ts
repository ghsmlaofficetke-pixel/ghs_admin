import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const login = createAsyncThunk(
  'auth/login',
  async (data: { email: string; password: string }) => {
    const res = await api.post('/users/login', data)
    localStorage.setItem('token', res.data.token)
    return res.data
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null as any,
    token: localStorage.getItem('token'),
  },
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      localStorage.removeItem('token')
    },
  },
  extraReducers: builder => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
    })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
