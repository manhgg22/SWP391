import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { doctorService } from '../services/doctor.service';

export const createDoctor = asyncHandler(async (req: Request, res: Response) => {
  const doctorData = req.body;
  const newDoctor = await doctorService.createDoctor(doctorData);
  res.status(201).json(newDoctor);
});

export const getDoctors = asyncHandler(async (req: Request, res: Response) => {
  const { specialtyId, keyword, page = '1', pageSize = '10' } = req.query as {
    specialtyId?: string;
    keyword?: string;
    page?: string;
    pageSize?: string;
  };

  const result = await doctorService.getDoctors({
    specialtyId,
    keyword,
    page: parseInt(page),
    pageSize: parseInt(pageSize),
  });

  res.json(result);
});

export const getDoctorById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const doctor = await doctorService.getDoctorById(id);
  res.json(doctor);
});