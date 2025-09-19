import { baseApi } from '@/app/api'

interface AuthState {
  accessToken: string | null
  isAuthenticated: boolean
  user: {
    id: string
    email: string
    role: string
    name: string
    phone: string
    avatarUrl?: string
  } | null
}

const initialState: AuthState = {
  accessToken: null,
  isAuthenticated: false,
  user: null,
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<
      { accessToken: string; user: AuthState['user'] },
      { email: string; password: string; remember?: boolean }
    >({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    forgotPassword: builder.mutation<void, { email: string }>({
      query: (data) => ({
        url: '/auth/forgot',
        method: 'POST',
        body: data,
      }),
    }),
    resetPassword: builder.mutation<
      void,
      { token: string; password: string }
    >({
      query: (data) => ({
        url: '/auth/reset',
        method: 'POST',
        body: data,
      }),
    }),
    getMe: builder.query<AuthState['user'], void>({
      query: () => '/users/me',
    }),
    updateProfile: builder.mutation<
      AuthState['user'],
      { name: string; phone: string; avatarUrl?: string }
    >({
      query: (data) => ({
        url: '/users/me',
        method: 'PUT',
        body: data,
      }),
    }),
    register: builder.mutation<any, { email: string; password: string }>({
      query: (data) => ({
        url: '/auth/register',
        method: 'POST',
        body: data,
      }),
    }),
  }),
})

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetMeQuery,
  useUpdateProfileMutation,
  useRegisterMutation,
} = authApi

export interface LoginPayload {
  email: string
  password: string
  remember?: boolean
}

// Export auth slice
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ accessToken: string; user: AuthState['user'] }>
    ) => {
      state.accessToken = action.payload.accessToken
      state.user = action.payload.user
      state.isAuthenticated = true
    },
    clearCredentials: (state) => {
      state.accessToken = null
      state.user = null
      state.isAuthenticated = false
    },
  },
})

export const { setCredentials, clearCredentials } = authSlice.actions
export default authSlice.reducer