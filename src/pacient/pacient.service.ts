import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';
import { CreatePacientDto } from './dto/create-pacient.dto';
import { PacientResponseDto } from './dto/pacient-response.dto';
import * as bcrypt from 'bcrypt';
import { UpdatePacientDto } from './dto/update-pacient.dto';

@Injectable()
export class PacientService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePacientDto): Promise<PacientResponseDto> {
    const existingPacient = await this.prisma.pacient.findUnique({
      where: { email: data.email },
    });

    if (existingPacient) {
      throw new BadRequestException('Pacient with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const pacient = await this.prisma.pacient.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        birthDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return pacient;
  }

  async findAll(): Promise<PacientResponseDto[]> {
    const pacients: PacientResponseDto[] = await this.prisma.pacient.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        birthDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return pacients.map((pacient) => new PacientResponseDto(pacient));
  }

  async findById(id: string): Promise<PacientResponseDto> {
    const pacient = await this.prisma.pacient.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        birthDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!pacient) {
      throw new NotFoundException(`Pacient not found`);
    }

    return new PacientResponseDto(pacient);
  }

  async updatePacient(
    id: string,
    data: UpdatePacientDto,
  ): Promise<PacientResponseDto> {
    const pacient = await this.prisma.pacient.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        birthDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!pacient) {
      throw new NotFoundException(`Pacient not found`);
    }

    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      data.password = hashedPassword;
    }

    const updatedPacient = await this.prisma.pacient.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        birthDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return new PacientResponseDto(updatedPacient);
  }

  async removePacient(id: string): Promise<void> {
    const pacient = await this.prisma.pacient.findUnique({
      where: { id },
    });

    if (!pacient) {
      throw new NotFoundException(`Pacient not found`);
    }

    await this.prisma.pacient.delete({
      where: { id },
    });
  }
}
