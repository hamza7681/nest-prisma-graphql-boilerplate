import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Extract the JWT from the 'auth-token' cookie
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => (req?.cookies?.['auth-token'] as string) ?? null,
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  validate(payload: { userId: string }) {
    // whatever is returned here will be available in the request object as req.user
    return { userId: payload.userId };
  }
}
