import { baseApi as rawBaseApi } from '@/app/api'

const baseApi = rawBaseApi.enhanceEndpoints({
  addTagTypes: ['Doctor', 'Patient', 'Specialty'],
})

interface Doctor {
  _id: string
  userId: {
    _id: string
    email: string
    name: string
    phone: string
    avatarUrl?: string
  }
  specialties: Array<{
    _id: string
    name: string
  }>
  bio: string
  room: string
}

interface Patient {
  _id: string
  userId: {
    _id: string
    email: string
    name: string
    phone: string
    avatarUrl?: string
  }
  dob: string
  gender: 'male' | 'female' | 'other'
  address: string
  insuranceNumber: string
}

interface Specialty {
  _id: string
  name: string
  description?: string
}

// Doctor API slice
export const doctorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createDoctor: builder.mutation<
      Doctor,
      {
        email: string
        password: string
        name: string
        phone: string
        specialties: string[]
        bio: string
        room: string
      }
    >({
      query: (data) => ({
        url: '/doctors',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result) => (result ? [{ type: 'Doctor' as const, id: 'LIST' }] : []),
    }),
    getDoctors: builder.query<
      Doctor[],
      { specialtyId?: string; keyword?: string; page?: number; pageSize?: number }
    >({
      query: (params) => ({
        url: '/doctors',
        params,
      }),
      providesTags: (result) =>
        result ? [{ type: 'Doctor' as const, id: 'LIST' }] : [],
    }),
  }),
})

// Patient API slice
export const patientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPatient: builder.mutation<
      Patient,
      {
        email: string
        password: string
        name: string
        phone: string
        dob: string
        gender: 'male' | 'female' | 'other'
        address: string
        insuranceNumber: string
      }
    >({
      query: (data) => ({
        url: '/patients',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result) => (result ? [{ type: 'Patient' as const, id: 'LIST' }] : []),
    }),
    getPatients: builder.query<
      Patient[],
      { keyword?: string; page?: number; pageSize?: number }
    >({
      query: (params) => ({
        url: '/patients',
        params,
      }),
      providesTags: (result) =>
        result ? [{ type: 'Patient' as const, id: 'LIST' }] : [],
    }),
  }),
})

// Receptionist API slice
export const receptionistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSpecialties: builder.query<Specialty[], void>({
      query: () => '/specialties',
      providesTags: [{ type: 'Specialty', id: 'LIST' }],
    }),
    // ...other endpoints...
  }),
})

export const {
  useCreateDoctorMutation,
  useGetDoctorsQuery,
} = doctorApi

export const {
  useCreatePatientMutation,
  useGetPatientsQuery,
} = patientApi

export const {
  useGetSpecialtiesQuery,
} = receptionistApi