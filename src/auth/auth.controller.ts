import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiCookieAuth,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtRefreshGuard } from 'src/shared/guards/jwtRefresh.guard';
import { Response, Request } from 'express';
import { Public } from 'src/shared/decorators/public.decorator';
import { Throttle } from '@nestjs/throttler';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        role: {
          type: 'string',
          example: 'doctor',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async login(
    @Body() data: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUser(
      data.email,
      data.password,
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

    return { access_token: accessToken, role: user.role };
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiCookieAuth()
  @ApiResponse({
    status: 200,
    description: 'Token refresh successful',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        refresh_token: {
          type: 'string',
          example: 'dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...',
        },
        role: {
          type: 'string',
          example: 'doctor',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refresh(@Req() req: Request) {
    const user = req.user as any;

    const refreshToken = req.cookies?.refresh_token;

    const result = await this.authService.refreshTokens(
      user.id,
      user.role,
      refreshToken,
    );

    return { ...result, role: user.role };
  }

  @UseGuards(JwtRefreshGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User logout' })
  @ApiCookieAuth()
  @ApiResponse({
    status: 200,
    description: 'Logout successful',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Logout successful',
        },
      },
    },
  })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user as any;

    await this.authService.logout(user.id, user.role);

    res.clearCookie('refresh_token', { path: '/auth' });
    return { message: 'Logout successful' };
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Profile returned successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMe(@ActiveUser() user: { id: string; role: string }) {
    return this.authService.getMe(user.id, user.role);
  }
}

