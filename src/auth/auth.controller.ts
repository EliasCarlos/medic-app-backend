import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() data: LoginDto) {
    const user = await this.authService.validateUser(
      data.email,
      data.password,
      data.role,
    );
    return this.authService.login({
      id: user.id,
      email: user.email,
      role: data.role,
    });

    return this.authService.login(user);
  }
}
