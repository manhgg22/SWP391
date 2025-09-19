import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, "Token is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required")
  })
}).refine((data) => data.body.password === data.body.confirmPassword, {
  message: "Passwords do not match",
  path: ["body.confirmPassword"]
});

export const createAppointmentSchema = z.object({
  body: z.object({
    patientId: z.string().min(1, "Patient ID is required"),
    doctorId: z.string().min(1, "Doctor ID is required"),
    date: z.string().datetime("Invalid date format"),
    reason: z.string().min(1, "Reason is required"),
    status: z.enum(['scheduled', 'cancelled', 'completed']).default('scheduled'),
  })
});

export const updateProfileSchema = z.object({
  body: z.object({
    fullName: z.string().min(1, "Full name is required").optional(),
    email: z.string().email("Invalid email address").optional(),
    phoneNumber: z.string().regex(/^\+?[0-9]{10,12}$/, "Invalid phone number").optional(),
    address: z.string().optional(),
    dateOfBirth: z.string().datetime("Invalid date format").optional()
  })
});

export const registerSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
  name: z.string().min(1, "Tên không được để trống"),
  phone: z.string().min(1, "Số điện thoại không được để trống"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;