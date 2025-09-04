import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreatePacientDto } from './create-pacient.dto';

export class UpdatePacientDto extends PartialType(CreatePacientDto) {
  @ApiPropertyOptional({
    description: 'Pacient name',
    example: 'João da Silva',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'Date of birth in ISO 8601 format',
    example: '1990-05-10',
  })
  birthDate?: string;

  @ApiPropertyOptional({
    description: 'Pacient email',
    example: 'joao@email.com',
  })
  email?: string;

  @ApiPropertyOptional({
    description: 'Pacient password',
    example: 'newPassword123',
  })
  password?: string;

  @ApiPropertyOptional({
    description: 'Pacient phone',
    example: '+55 21 99999-9999',
  })
  phone?: string;
}
