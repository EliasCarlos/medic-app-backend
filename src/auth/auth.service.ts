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

    return { access_token: this.jwtService.sign(payload) };
  }
}
