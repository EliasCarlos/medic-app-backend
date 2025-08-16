import { AppointmentEntity } from 'src/shared/types/prisma-types';

export class AppointmentResponseDto {
  id: string;
  date: Date;
  doctorId: string;
  pacientId: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(appointment: AppointmentEntity) {
    this.id = appointment.id;
    this.date = appointment.date;
    this.doctorId = appointment.doctorId;
    this.pacientId = appointment.pacientId;
    this.createdAt = appointment.createdAt;
    this.updatedAt = appointment.updatedAt;
  }
}
