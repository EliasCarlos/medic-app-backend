import { Module } from '@nestjs/common';
import { PrismaModule } from './shared/database/prisma.module';
import { DoctorModule } from './doctor/doctor.module';
import { AppConfigModule } from './shared/config/config.module';
import { PacientModule } from './pacient/pacient.module';
import { AppointmentModule } from './appointment/appointment.module';
import { PrescriptionModule } from './prescription/prescription.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './shared/guards/jwt-auth.guard';
import { RolesGuard } from './shared/guards/roles.guard';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    AppConfigModule,
    PrismaModule,
    DoctorModule,
    PacientModule,
    AppointmentModule,
    PrescriptionModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
