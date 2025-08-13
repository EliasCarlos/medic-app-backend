import { Module } from '@nestjs/common';
import { PrismaModule } from './shared/database/prisma.module';
import { DoctorModule } from './doctor/doctor.module';
import { AppConfigModule } from './shared/config/config.module';
import { PacientModule } from './pacient/pacient.module';
import { AppointmentModule } from './appointment/appointment.module';
import { PrescriptionModule } from './prescription/prescription.module';

@Module({
  imports: [AppConfigModule, PrismaModule, DoctorModule, PacientModule, AppointmentModule, PrescriptionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
