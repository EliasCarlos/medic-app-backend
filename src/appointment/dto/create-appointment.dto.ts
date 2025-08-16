import { IsDateString, IsUUID } from 'class-validator';

export class CreateAppointmentDto {
  @IsDateString()
  date: string;

  @IsUUID()
  doctorId: string;

  @IsUUID()
  pacientId: string;
}
