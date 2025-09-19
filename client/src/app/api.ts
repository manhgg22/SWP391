import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from './store'

// Define base api slice with authentication
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Lấy accessToken từ redux state
      const token = (getState() as any).auth.accessToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
})

// Export hooks for usage in components
export const enhancedApi = baseApi.enhanceEndpoints({
  addTagTypes: ['User', 'Doctor', 'Patient', 'Schedule', 'Appointment', 'Feedback'],
})