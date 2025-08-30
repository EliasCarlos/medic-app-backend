import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService, UserRole } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtRefreshGuard } from 'src/shared/guards/jwtRefresh.guard';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() data: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUser(
      data.email,
      data.password,
      data.role,
    );

    const { accessToken, refreshToken } = await this.authService.login({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/auth',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { access_token: accessToken };
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request) {
    const user = req.user as any;

    const refreshToken = req.cookies?.refresh_token;

    const result = await this.authService.refreshTokens(
      user.id,
      user.role,
      refreshToken,
    );

    return result;
  }

  @UseGuards(JwtRefreshGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user as any;

    await this.authService.logout(user.id, user.role);

    res.clearCookie('refresh_token', { path: '/auth' });
    return { message: 'Logout successful' };
  }
}
