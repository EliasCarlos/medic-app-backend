import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JwtPayload, UserRole } from 'src/auth/auth.service';
import { EnvService } from 'src/shared/config/config.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private envService: EnvService) {
    super({
      jwtFromRequest: (req: Request) => {
        if (!req.cookies?.refresh_token) {
          throw new UnauthorizedException('Refresh token missing');
        }

        return req.cookies.refresh_token;
      },
      secretOrKey: envService.jwtSecret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role as UserRole,
    };
  }
}
