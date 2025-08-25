import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePrescriptionDto {
  @IsNotEmpty()
  appointmentId: string;

  @IsNotEmpty()
  @IsString()
  medicine: string;

  @IsNotEmpty()
  @IsString()
  dosage: string;

  @IsOptional()
  @IsString()
  instructions?: string;

  @IsOptional()
  @IsDateString()
  date?: string;
}
