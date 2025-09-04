import { ApiProperty } from '@nestjs/swagger';
import { AppointmentEntity } from 'src/shared/types/prisma-types';

export class AppointmentResponseDto {
  @ApiProperty({
    description: 'Unique appointment identifier',
    example: 'b5b55468-9e73-4a06-b25d-199b41420c9f',
  })
  id: string;

  @ApiProperty({
    description: 'Appointment date and time',
    example: '2023-05-15T10:00:00Z',
  })
  date: Date;

  @ApiProperty({
    description: 'Doctor identifier for this appointment',
    example: 'd7b55468-9e73-4a06-b25d-199b41420c9f',
  })
  doctorId: string;

  @ApiProperty({
    description: 'Patient identifier for this appointment',
    example: 'p9b55468-9e73-4a06-b25d-199b41420c9f',
  })
  pacientId: string;

  @ApiProperty({
    description: 'Appointment creation timestamp',
    example: '2023-05-01T08:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Appointment last update timestamp',
    example: '2023-05-01T09:00:00Z',
  })
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
