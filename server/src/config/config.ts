import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  mongoUri: string;
  jwtAccessSecret: string;
  jwtRefreshSecret: string;
  resetTokenSecret: string;
  mailHost: string;
  mailPort: number;
  mailUser: string;
  mailPass: string;
  clientUrl: string;
  accessTokenExpiresIn: string;
  refreshTokenExpiresIn: string;
  resetTokenExpiresIn: string;
  jwtSecret: string;
}

export const config: Config = {
  port: Number(process.env.PORT) || 4000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/clinic',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'access_secret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
  resetTokenSecret: process.env.RESET_TOKEN_SECRET || 'reset_secret',
  mailHost: process.env.MAIL_HOST || 'smtp.ethereal.email',
  mailPort: parseInt(process.env.MAIL_PORT || '587', 10),
  mailUser: process.env.MAIL_USER || '',
  mailPass: process.env.MAIL_PASS || '',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  accessTokenExpiresIn: '15m',
  refreshTokenExpiresIn: '7d',
  resetTokenExpiresIn: '1h',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
};