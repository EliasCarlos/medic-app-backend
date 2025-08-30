import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { EnvService } from 'src/shared/config/config.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtRefreshStrategy } from './JwtRefreshStrategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [EnvService],
      useFactory: (envSerive: EnvService) => ({
        secret: envSerive.jwtSecret,
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
  exports: [AuthService],
})
export class AuthModule {}
