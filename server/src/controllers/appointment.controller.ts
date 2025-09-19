import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { appointmentService } from '../services/appointment.service';

export const createAppointment = asyncHandler(async (req: Request, res: Response) => {
  const appointmentData = req.body;
  const newAppointment = await appointmentService.createAppointment(appointmentData);
  res.status(201).json(newAppointment);
});

export const getAppointments = asyncHandler(async (req: Request, res: Response) => {
  const { patientId, doctorId, dateFrom, dateTo, status, page = '1', pageSize = '10' } = req.query as {
    patientId?: string;
    doctorId?: string;
    dateFrom?: string;
    dateTo?: string;
    status?: string;
    page?: string;
    pageSize?: string;
  };

  const result = await appointmentService.getAppointments({
    patientId,
    doctorId,
    dateFrom,
    dateTo,
    status,
    page: parseInt(page),
    pageSize: parseInt(pageSize),
  });

  res.json(result);
});

export const cancelAppointment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const appointment = await appointmentService.cancelAppointment(id, 'receptionist');
  res.json(appointment);
});