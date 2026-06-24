import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { Response } from 'express';

import { asyncTryCatch } from 'src/utils/tryCatch';

@Injectable()
export class CommonService {
  constructor(private jwtService: JwtService) {}

  async hashString({ value }: { value: string }): Promise<string> {
    const saltRounds = 10;
    const { response, error } = await asyncTryCatch({
      fn: async () => bcrypt.hash(value, saltRounds),
    });
    if (error) throw error;

    return response;
  }

  async compareHashedString({
    value,
    hashedValue,
  }: {
    value: string;
    hashedValue: string;
  }): Promise<boolean> {
    const { response, error } = await asyncTryCatch({
      fn: async () => bcrypt.compare(value, hashedValue),
    });
    if (error) throw error;

    return response;
  }

  async generateToken<T extends Record<string, unknown>>({
    payload,
    expiresIn = '1d',
  }: {
    payload: T;
    expiresIn?: string | number;
  }): Promise<string> {
    const { response, error } = await asyncTryCatch({
      fn: async () =>
        this.jwtService.signAsync(payload, {
          secret: process.env.JWT_SECRET!,
          expiresIn: expiresIn as never,
        }),
    });

    if (error) {
      throw error instanceof Error ? error : new Error(String(error));
    }

    return response;
  }

  async verifyToken<T extends Record<string, unknown>>({
    token,
  }: {
    token: string;
  }): Promise<T> {
    const { response, error } = await asyncTryCatch({
      fn: async () => this.jwtService.verifyAsync<T>(token),
    });

    if (error) {
      throw error instanceof Error ? error : new Error(String(error));
    }

    return response;
  }

  setCookies({ token, res }: { token: string; res: Response }) {
    res.cookie('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  clearCookies({ res }: { res: Response }) {
    res.clearCookie('auth-token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  }
}
