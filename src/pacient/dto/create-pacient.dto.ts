import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

export class CreatePacientDto {
  @ApiProperty({
    example: 'Maria Silva',
    description: 'Full name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '1995-08-20',
    description: 'Date of birth in ISO format (YYYY-MM-DD)',
  })
  @IsDateString()
  @IsNotEmpty()
  birthDate: string;

  @ApiProperty({
    example: 'maria.silva@email.com',
    description: 'Pacient email',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'securepassword123',
    description: 'Pacient password (minimum 6 and maximum 20 characters)',
    minLength: 6,
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  password: string;

  @ApiProperty({
    example: '+55 11 91234-5678',
    description: 'Contact telephone',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;
}
