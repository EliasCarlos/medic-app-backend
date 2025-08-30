import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/shared/database/prisma.service';

export type UserRole = 'doctor' | 'pacient';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(email: string, password: string, role: UserRole) {
    const user =
      role === 'doctor'
        ? await this.prisma.doctor.findUnique({ where: { email } })
        : await this.prisma.pacient.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    return { ...user, role };
  }

  async login(user: { id: string; email: string; role: UserRole }) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    if (user.role === 'doctor') {
      await this.prisma.doctor.update({
        where: { id: user.id },
        data: { refreshToken: hashedRefreshToken },
      });
    } else {
      await this.prisma.pacient.update({
        where: { id: user.id },
        data: { refreshToken: hashedRefreshToken },
      });
    }

    return { accessToken, refreshToken };
  }

  async refreshTokens(userId: string, role: UserRole, refreshToken: string) {
    const user =
      role === 'doctor'
        ? await this.prisma.doctor.findUnique({ where: { id: userId } })
        : await this.prisma.pacient.findUnique({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('Access Denied');
    }

    if (!user.refreshToken) {
      throw new UnauthorizedException('Access Denied');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.login({ id: user.id, email: user.email, role });
  }

  async logout(userId: string, role: UserRole) {
    if (role === 'doctor') {
      const updated = await this.prisma.doctor.update({
        where: { id: userId },
        data: { refreshToken: null },
      });
    } else {
      const updated = await this.prisma.pacient.update({
        where: { id: userId },
        data: { refreshToken: null },
      });
    }
    return { message: 'Logout successful' };
  }
}
