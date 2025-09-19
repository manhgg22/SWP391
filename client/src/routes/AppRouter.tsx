import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ReceptionistLayout } from '@/components/ReceptionistLayout';
import { LoginPage } from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/',
    element: <ReceptionistLayout />,
    children: [
      {
        path: 'profile',
        lazy: async () => {
          const m = await import('@/pages/ProfilePage');
          return { Component: m.default };
        },
      },
      {
        path: 'schedules',
        lazy: async () => {
          const m = await import('@/pages/SchedulePage');
          return { Component: m.default };
        },
      },
      {
        path: 'accounts',
        lazy: async () => {
          const m = await import('@/pages/AccountsPage');
          return { Component: m.default };
        },
      },
      {
        path: 'appointments',
        lazy: async () => {
          const m = await import('@/pages/AppointmentsPage');
          return { Component: m.default };
        },
      },
      {
        path: 'feedbacks',
        lazy: async () => {
          const m = await import('@/pages/FeedbacksPage');
          return { Component: m.default };
        },
      },
    ],
  },
]);

export const AppRouter: React.FC = () => <RouterProvider router={router} />;
