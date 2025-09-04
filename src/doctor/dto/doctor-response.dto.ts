import { ApiProperty } from '@nestjs/swagger';

export class DoctorResponseDto {
  @ApiProperty({
    description: 'Unique doctor identifier',
    example: 'b5b55468-9e73-4a06-b25d-199b41420c9f',
  })
  id: string;

  @ApiProperty({
    description: 'Doctor Full Name',
    example: 'Dr. João Silva',
  })
  name: string;

  @ApiProperty({
    description: 'Doctor medical specialty',
    example: 'Cardiologia',
  })
  medicalSpecialty: string;

  @ApiProperty({
    description: 'Doctor medical registration number',
    example: 'CRM/SP 123456',
  })
  medicalRegistration: string;

  @ApiProperty({
    description: 'Doctor email',
    example: 'joao.silva@hospital.com',
  })
  email: string;

  @ApiProperty({
    description: 'Doctor contact telephone number',
    example: '+55 11 91234-5678',
  })
  phone: string;

  constructor(partial: Partial<DoctorResponseDto>) {
    Object.assign(this, partial);
  }
}
