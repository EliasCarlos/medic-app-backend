import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateDoctorDto } from './create-doctor.dto';

export class UpdateDoctorDto extends PartialType(CreateDoctorDto) {
  @ApiPropertyOptional({
    description: 'Doctor Full Name',
    example: 'Dr. João Silva',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'Doctor medical specialty',
    example: 'Cardiologia',
  })
  medicalSpecialty?: string;

  @ApiPropertyOptional({
    description: 'Doctor medical registration number',
    example: 'CRM/SP 123456',
  })
  medicalRegistration?: string;

  @ApiPropertyOptional({
    description: 'Doctor email',
    example: 'joao.silva@hospital.com',
  })
  email?: string;

  @ApiPropertyOptional({
    description: 'Doctor contact telephone number',
    example: '+55 11 91234-5678',
  })
  phone?: string;
}
