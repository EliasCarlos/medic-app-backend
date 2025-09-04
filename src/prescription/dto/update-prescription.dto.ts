import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreatePrescriptionDto } from './create-prescription.dto';

export class UpdatePrescriptionDto extends PartialType(CreatePrescriptionDto) {
  @ApiPropertyOptional({
    description: 'Consultation ID associated with the prescription',
    example: 'a2f1b5d8-2c3e-4b7f-9d8b-4c5e6f7a8b9c',
  })
  appointmentId?: string;

  @ApiPropertyOptional({
    description: 'Name of prescribed medicine',
    example: 'Amoxicilina 500mg',
  })
  medicine?: string;

  @ApiPropertyOptional({
    description: 'Dosage of the medicine',
    example: '1 capsule every 8 hours for 7 days',
  })
  dosage?: string;

  @ApiPropertyOptional({
    description: 'Additional instructions from the doctor',
    example: 'Take after meals',
  })
  instructions?: string;

  @ApiPropertyOptional({
    description: 'Prescription issue date',
    example: '2025-09-01T12:30:00Z',
    type: String,
    format: 'date-time',
  })
  date?: string;
}
