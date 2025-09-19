import jwt from 'jsonwebtoken';
import { config } from '../config/config';

export interface TokenPayload {
  userId: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface ResetTokenPayload {
  email: string;
  iat?: number;
  exp?: number;
}

export const generateAuthTokens = (id: string, role: string) => {
  const payload: TokenPayload = { userId: id, role };

  const accessToken = jwt.sign(
    payload,
    config.jwtAccessSecret,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    payload,
    config.jwtRefreshSecret,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

export const generateResetToken = (email: string): string => {
  return jwt.sign(
    { email } as ResetTokenPayload,
    config.resetTokenSecret,
    { expiresIn: '1h' }
  );
};

export const verifyToken = <T extends TokenPayload | ResetTokenPayload>(
  token: string,
  secret: string
): T => {
  try {
    return jwt.verify(token, secret) as T;
  } catch (error) {
    throw new Error('Invalid token');
  }
};