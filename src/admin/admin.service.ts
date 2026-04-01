import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';
import { HashingService } from 'src/shared/hashing/hashing.service';
import { CreateAdminDto } from './dto/create-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private hashingService: HashingService,
  ) {}

  async create(data: CreateAdminDto) {
    const existingAdmin = await this.prisma.admin.findUnique({
      where: { email: data.email },
    });

    if (existingAdmin) {
      throw new ConflictException('Admin with this email already exists');
    }

    const hashedPassword = await this.hashingService.hash(data.password);

    const admin = await this.prisma.admin.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    const { password, refreshToken, ...result } = admin;
    return result;
  }

  async findByEmail(email: string) {
    return this.prisma.admin.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return this.prisma.admin.findUnique({ where: { id } });
  }
}
