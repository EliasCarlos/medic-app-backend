import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreatePatientDto } from './create-patient.dto';

export class UpdatePatientDto extends PartialType(CreatePatientDto) {
  @ApiPropertyOptional({
    description: 'Patient name',
    example: 'João da Silva',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'Date of birth in ISO 8601 format',
    example: '1990-05-10',
  })
  birthDate?: string;

  @ApiPropertyOptional({
    description: 'Patient email',
    example: 'joao@email.com',
  })
  email?: string;

  @ApiPropertyOptional({
    description: 'Patient password',
    example: 'newPassword123',
  })
  password?: string;

  @ApiPropertyOptional({
    description: 'Patient phone',
    example: '+55 21 99999-9999',
  })
  phone?: string;
}
