import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './auth.service';
import { EnvService } from 'src/shared/config/config.service';
import { UserRole } from 'src/shared/types/userRoles-types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private envService: EnvService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: envService.jwtSecret,
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role as UserRole,
    };
  }
}
