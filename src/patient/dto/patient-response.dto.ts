import { ApiProperty } from '@nestjs/swagger';

export class PatientResponseDto {
  @ApiProperty({
    description: 'Unique patient identifier',
    example: 'b5b55468-9e73-4a06-b25d-199b41420c9f',
  })
  id: string;

  @ApiProperty({
    description: 'Patient Full Name',
    example: 'Maria Silva',
  })
  name: string;

  @ApiProperty({
    description: 'Date of birth in ISO 8601 format',
    example: '1995-08-20',
  })
  birthDate: string;

  @ApiProperty({
    description: 'Patient email',
    example: 'maria@email.com',
  })
  email: string;

  @ApiProperty({
    description: 'Patient contact telephone number',
    example: '+55 11 91234-5678',
  })
  phone: string;

  constructor(partial: Partial<PatientResponseDto>) {
    Object.assign(this, partial);
  }
}
