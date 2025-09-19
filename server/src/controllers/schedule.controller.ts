import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { scheduleService } from '../services/schedule.service';

export const getSchedules = asyncHandler(async (req: Request, res: Response) => {
  const { doctorId, date, specialtyId } = req.query as {
    doctorId?: string;
    date?: string;
    specialtyId?: string;
  };

  const schedules = await scheduleService.getSchedules({
    doctorId,
    date,
    specialtyId,
  });

  res.json(schedules);
});

export const createSchedule = asyncHandler(async (req: Request, res: Response) => {
  const scheduleData = req.body;
  const newSchedule = await scheduleService.createSchedule(scheduleData);
  res.status(201).json(newSchedule);
});

export const updateSchedule = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  const updatedSchedule = await scheduleService.updateSchedule(id, updateData);
  res.json(updatedSchedule);
});

export const deleteSchedule = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await scheduleService.deleteSchedule(id);
  res.status(204).send();
});