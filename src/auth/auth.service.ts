import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Admin, Doctor, Patient } from '@prisma/client';
import { PrismaService } from 'src/shared/database/prisma.service';
import { UserRole } from 'src/shared/types/userRoles-types';
import { HashingService } from 'src/shared/hashing/hashing.service';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

type AuthUser = Admin | Doctor | Patient;

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private hashingService: HashingService,
  ) {}

  async validateUser(email: string, password: string) {
    // Search for admin first
    let user: AuthUser | null = await this.prisma.admin.findUnique({
      where: { email },
    });
    let role: UserRole = 'admin';

    // If admin not found, search for doctor
    if (!user) {
      user = await this.prisma.doctor.findUnique({ where: { email } });
      role = 'doctor';
    }

    // If doctor not found, search for patient
    if (!user) {
      user = await this.prisma.patient.findUnique({
        where: { email },
      });
      role = 'patient';
    }

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await this.hashingService.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    // Return user with guaranteed role (either from DB or search)
    return { ...user, role: user.role || role };
  }

  async login(user: { id: string; email: string; role: string }) {
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

    const hashedRefreshToken = await this.hashingService.hash(refreshToken);

    if (user.role === 'admin') {
      await this.prisma.admin.update({
        where: { id: user.id },
        data: { refreshToken: hashedRefreshToken },
      });
    } else if (user.role === 'doctor') {
      await this.prisma.doctor.update({
        where: { id: user.id },
        data: { refreshToken: hashedRefreshToken },
      });
    } else {
      await this.prisma.patient.update({
        where: { id: user.id },
        data: { refreshToken: hashedRefreshToken },
      });
    }

    return { accessToken, refreshToken };
  }

  async refreshTokens(userId: string, role: UserRole, refreshToken: string) {
    const user =
      role === 'admin'
        ? await this.prisma.admin.findUnique({ where: { id: userId } })
        : role === 'doctor'
        ? await this.prisma.doctor.findUnique({ where: { id: userId } })
        : await this.prisma.patient.findUnique({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('Access Denied');
    }

    if (!user.refreshToken) {
      throw new UnauthorizedException('Access Denied');
    }

    const refreshTokenMatches = await this.hashingService.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.login({ id: user.id, email: user.email, role: user.role });
  }

  async logout(userId: string, role: UserRole) {
    if (role === 'admin') {
      await this.prisma.admin.update({
        where: { id: userId },
        data: { refreshToken: null },
      });
    } else if (role === 'doctor') {
      await this.prisma.doctor.update({
        where: { id: userId },
        data: { refreshToken: null },
      });
    } else {
      await this.prisma.patient.update({
        where: { id: userId },
        data: { refreshToken: null },
      });
    }
    return { message: 'Logout successful' };
  }

  async getMe(userId: string, role: string) {
    const user =
      role === 'admin'
        ? await this.prisma.admin.findUnique({ where: { id: userId } })
        : role === 'doctor'
        ? await this.prisma.doctor.findUnique({ where: { id: userId } })
        : await this.prisma.patient.findUnique({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}

