import { IsDateString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({
    description: 'Appointment date and time in ISO 8601 format',
    example: '2023-05-15T10:00:00Z',
  })
  @IsDateString()
  date: string;

  @ApiProperty({
    description: 'Doctor identifier for this appointment',
    example: 'd7b55468-9e73-4a06-b25d-199b41420c9f',
  })
  @IsUUID()
  doctorId: string;

  @ApiProperty({
    description: 'Patient identifier for this appointment',
    example: 'p9b55468-9e73-4a06-b25d-199b41420c9f',
  })
  @IsUUID()
  pacientId: string;
}
