import { baseApi } from '@/app/api';

interface Specialty {
  _id: string;
  name: string;
  description: string;
}

interface Slot {
  start: string;
  end: string;
  capacity: number;
  bookedCount: number;
}

interface Schedule {
  _id: string;
  doctorId: string;
  date: string;
  slots: Slot[];
  createdAt: string;
  updatedAt: string;
}

interface Appointment {
  _id: string;
  patientId: string;
  doctorId: string;
  scheduleId: string;
  slotIndex: number;
  reason: string;
  note: string;
  status: 'confirmed' | 'canceled' | 'completed' | 'no_show';
  canceledBy?: 'patient' | 'doctor' | 'receptionist';
  canceledAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface Feedback {
  _id: string;
  appointmentId: string;
  doctorId: string;
  patientId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Doctor {
  _id: string;
  userId: {
    _id: string;
    email: string;
    name: string;
    phone: string;
    avatarUrl?: string;
  };
  specialties: Array<{
    _id: string;
    name: string;
  }>;
  bio: string;
  room: string;
}

interface Patient {
  _id: string;
  userId: {
    _id: string;
    email: string;
    name: string;
    phone: string;
    avatarUrl?: string;
  };
  dob: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  insuranceNumber: string;
}

// Add TagTypes type for better type safety
type TagTypes = 'Doctor' | 'Patient' | 'Specialty' | 'Schedule' | 'Appointment' | 'Feedback';

// Specialty API slice
export const apiSlice = baseApi
  .enhanceEndpoints({
    addTagTypes: [
      'Doctor',
      'Patient',
      'Specialty',
      'Schedule',
      'Appointment',
      'Feedback',
    ],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      // Specialty endpoints
      getSpecialties: builder.query<Specialty[], void>({
        query: () => '/specialties',
        providesTags: [{ type: 'Specialty' as const, id: 'LIST' }],
      }),

      // Doctor endpoints
      getDoctors: builder.query<
        Doctor[],
        { specialtyId?: string; keyword?: string; page?: number; pageSize?: number }
      >({
        query: (params) => ({
          url: '/doctors',
          params,
        }),
        providesTags: [{ type: 'Doctor' as const, id: 'LIST' }],
      }),
      createDoctor: builder.mutation<
        Doctor,
        {
          email: string;
          password: string;
          name: string;
          phone: string;
          specialties: string[];
          bio: string;
          room: string;
        }
      >({
        query: (data) => ({
          url: '/doctors',
          method: 'POST',
          body: data,
        }),
        invalidatesTags: [{ type: 'Doctor' as const, id: 'LIST' }],
      }),

      // Patient endpoints
      getPatients: builder.query<
        Patient[],
        { keyword?: string; page?: number; pageSize?: number }
      >({
        query: (params) => ({
          url: '/patients',
          params,
        }),
        providesTags: [{ type: 'Patient' as const, id: 'LIST' }],
      }),
      createPatient: builder.mutation<
        Patient,
        {
          email: string;
          password: string;
          name: string;
          phone: string;
          dob: string;
          gender: 'male' | 'female' | 'other';
          address: string;
          insuranceNumber: string;
        }
      >({
        query: (data) => ({
          url: '/patients',
          method: 'POST',
          body: data,
        }),
        invalidatesTags: [{ type: 'Patient' as const, id: 'LIST' }],
      }),

      // Schedule endpoints
      getSchedules: builder.query<
        Schedule[],
        { doctorId?: string; date?: string; specialtyId?: string }
      >({
        query: (params) => ({
          url: '/schedules',
          params,
        }),
        providesTags: ['Schedule'],
      }),
      createSchedule: builder.mutation<
        Schedule,
        { doctorId: string; date: string; slots: Omit<Slot, 'bookedCount'>[] }
      >({
        query: (data) => ({
          url: '/schedules',
          method: 'POST',
          body: data,
        }),
        invalidatesTags: ['Schedule'],
      }),
      updateSchedule: builder.mutation<
        Schedule,
        { id: string; slots: Omit<Slot, 'bookedCount'>[] }
      >({
        query: ({ id, ...data }) => ({
          url: `/schedules/${id}`,
          method: 'PUT',
          body: data,
        }),
        invalidatesTags: ['Schedule'],
      }),
      deleteSchedule: builder.mutation<void, string>({
        query: (id) => ({
          url: `/schedules/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['Schedule'],
      }),

      // Appointment endpoints
      getAppointments: builder.query<
        Appointment[],
        {
          patientId?: string;
          doctorId?: string;
          dateFrom?: string;
          dateTo?: string;
          status?: string;
          page?: number;
          pageSize?: number;
        }
      >({
        query: (params) => ({
          url: '/appointments',
          params,
        }),
        providesTags: ['Appointment'],
      }),
      createAppointment: builder.mutation<
        Appointment,
        {
          patientId: string;
          doctorId: string;
          scheduleId: string;
          slotIndex: number;
          reason: string;
          note?: string;
        }
      >({
        query: (data) => ({
          url: '/appointments',
          method: 'POST',
          body: data,
        }),
        invalidatesTags: ['Appointment', 'Schedule'],
      }),
      cancelAppointment: builder.mutation<void, string>({
        query: (id) => ({
          url: `/appointments/${id}/cancel`,
          method: 'PATCH',
        }),
        invalidatesTags: ['Appointment', 'Schedule'],
      }),

      // Feedback endpoints
      getFeedbacks: builder.query<
        Feedback[],
        {
          doctorId?: string;
          patientId?: string;
          rating?: number;
          from?: string;
          to?: string;
          page?: number;
          pageSize?: number;
        }
      >({
        query: (params) => ({
          url: '/feedbacks',
          params,
        }),
        providesTags: ['Feedback'],
      }),
    }),
  });

export const {
  useGetSpecialtiesQuery,
  useGetDoctorsQuery,
  useCreateDoctorMutation,
  useGetPatientsQuery,
  useCreatePatientMutation,
  useGetSchedulesQuery,
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
  useGetAppointmentsQuery,
  useCreateAppointmentMutation,
  useCancelAppointmentMutation,
  useGetFeedbacksQuery,
} = apiSlice;