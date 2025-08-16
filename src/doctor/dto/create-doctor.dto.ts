import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateDoctorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  password: string;

  @IsString()
  @IsNotEmpty()
  medicalSpecialty: string;

  @IsString()
  @IsNotEmpty()
  medicalRegistration: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;
}
