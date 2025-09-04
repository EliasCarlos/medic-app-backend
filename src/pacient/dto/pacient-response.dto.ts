import { ApiProperty } from '@nestjs/swagger';

export class PacientResponseDto {
  @ApiProperty({
    description: 'Unique pacient identifier',
    example: 'b5b55468-9e73-4a06-b25d-199b41420c9f',
  })
  id: string;

  @ApiProperty({
    description: 'Pacient Full Name',
    example: 'Maria Silva',
  })
  name: string;

  @ApiProperty({
    description: 'Date of birth in ISO 8601 format',
    example: '1995-08-20',
  })
  birthDate: string;

  @ApiProperty({
    description: 'Pacient email',
    example: 'maria@email.com',
  })
  email: string;

  @ApiProperty({
    description: 'Pacient contact telephone number',
    example: '+55 11 91234-5678',
  })
  phone: string;

  constructor(partial: Partial<PacientResponseDto>) {
    Object.assign(this, partial);
  }
}
