import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateAppointmentDto } from './create-appointment.dto';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  @ApiPropertyOptional({
    description: 'Appointment date and time in ISO 8601 format',
    example: '2023-05-15T10:00:00Z',
  })
  date?: string;

  @ApiPropertyOptional({
    description: 'Doctor identifier for this appointment',
    example: 'd7b55468-9e73-4a06-b25d-199b41420c9f',
  })
  doctorId?: string;

  @ApiPropertyOptional({
    description: 'Patient identifier for this appointment',
    example: 'p9b55468-9e73-4a06-b25d-199b41420c9f',
  })
  pacientId?: string;
}
