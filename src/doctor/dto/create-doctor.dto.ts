import { IsNotEmpty, IsString, Length, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDoctorDto {
  @ApiProperty({
    example: 'Dr. João Silva',
    description: 'Nome completo do médico',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'senhaSegura123',
    description: 'Senha de acesso (mínimo 6 caracteres, máximo 20)',
    minLength: 6,
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  password: string;

  @ApiProperty({
    example: 'Cardiologia',
    description: 'Especialidade médica',
  })
  @IsString()
  @IsNotEmpty()
  medicalSpecialty: string;

  @ApiProperty({
    example: 'CRM-123456',
    description: 'Registro do médico no conselho de classe',
  })
  @IsString()
  @IsNotEmpty()
  medicalRegistration: string;

  @ApiProperty({
    example: 'joao.silva@hospital.com',
    description: 'E-mail do médico',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '+55 11 91234-5678',
    description: 'Telefone de contato do médico',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;
}
