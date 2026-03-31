import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/shared/database/prisma.service';
import { UserRole } from 'src/shared/types/userRoles-types';
import { HashingService } from 'src/shared/hashing/hashing.service';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private hashingService: HashingService,
  ) {}

  async validateUser(email: string, password: string) {
    // Busca o médico primeiro
    let user = await this.prisma.doctor.findUnique({ where: { email } });
    let role: UserRole = 'doctor';

    // Se não encontrar o médico, busca o paciente
    if (!user) {
      const patient = await this.prisma.patient.findUnique({
        where: { email },
      });
      if (patient) {
        user = patient as any;
        role = 'patient';
      }
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

    // Retorna o usuário com o role garantido (seja do banco ou da busca)
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

    if (user.role === 'doctor') {
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
      role === 'doctor'
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
    if (role === 'doctor') {
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
}
