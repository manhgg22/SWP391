import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/config';
import { connectDB } from './config/db';
import { errorHandler } from './middleware/error';

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
import { authRouter } from './routes/auth.routes';
import { doctorRouter } from './routes/doctor.routes';
import { patientRouter } from './routes/patient.routes';
import { appointmentRouter } from './routes/appointment.routes';
import { scheduleRouter } from './routes/schedule.routes';
import { userRouter } from './routes/user.routes';
import { specialtyRouter } from './routes/specialty.routes';

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/doctors', doctorRouter);
app.use('/api/patients', patientRouter);
app.use('/api/appointments', appointmentRouter);
app.use('/api/schedules', scheduleRouter);
app.use('/api/users', userRouter);
app.use('/api/specialties', specialtyRouter);

// Error handling
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});