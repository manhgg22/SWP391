import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { patientService } from '../services/patient.service';

export const createPatient = asyncHandler(async (req: Request, res: Response) => {
  const patientData = req.body;
  const newPatient = await patientService.createPatient(patientData);
  res.status(201).json(newPatient);
});

export const getPatients = asyncHandler(async (req: Request, res: Response) => {
  const { keyword, page = '1', pageSize = '10' } = req.query as {
    keyword?: string;
    page?: string;
    pageSize?: string;
  };

  const result = await patientService.getPatients({
    keyword,
    page: parseInt(page),
    pageSize: parseInt(pageSize),
  });

  res.json(result);
});

export const getPatientById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const patient = await patientService.getPatientById(id);
  res.json(patient);
});