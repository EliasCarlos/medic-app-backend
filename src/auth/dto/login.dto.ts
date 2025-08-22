import { IsEmail, IsIn, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsIn(['doctor', 'pacient'])
  role: 'doctor' | 'pacient';
}
