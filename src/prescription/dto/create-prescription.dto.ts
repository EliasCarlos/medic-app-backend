import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePrescriptionDto {
  @ApiProperty({
    description: 'Prescription-related query ID',
    example: 'a2f1b5d8-2c3e-4b7f-9d8b-4c5e6f7a8b9c',
  })
  @IsNotEmpty()
  appointmentId: string;

  @ApiProperty({
    description: 'Name of prescribed medicine',
    example: 'Amoxicilina 500mg',
  })
  @IsNotEmpty()
  @IsString()
  medicine: string;

  @ApiProperty({
    description: 'Dosage of the medicine',
    example: '1 capsule every 8 hours for 7 days',
  })
  @IsNotEmpty()
  @IsString()
  dosage: string;

  @ApiPropertyOptional({
    description: 'Additional instructions from the doctor',
    example: 'Take after meals',
  })
  @IsOptional()
  @IsString()
  instructions?: string;

  @ApiPropertyOptional({
    description: 'Prescription issue date',
    example: '2025-09-01T12:30:00Z',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  date?: string;
}
