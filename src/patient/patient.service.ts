import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { PatientResponseDto } from './dto/patient-response.dto';
import * as bcrypt from 'bcrypt';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePatientDto): Promise<PatientResponseDto> {
    const existingPatient = await this.prisma.patient.findUnique({
      where: { email: data.email },
    });

    if (existingPatient) {
      throw new BadRequestException('Patient with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const patient = await this.prisma.patient.create({
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

    return patient;
  }

  async findAll(): Promise<PatientResponseDto[]> {
    const patients: PatientResponseDto[] = await this.prisma.patient.findMany({
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

    return patients.map((patient) => new PatientResponseDto(patient));
  }

  async findById(id: string): Promise<PatientResponseDto> {
    const patient = await this.prisma.patient.findUnique({
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

    if (!patient) {
      throw new NotFoundException(`Patient not found`);
    }

    return new PatientResponseDto(patient);
  }

  async updatePatient(
    id: string,
    currentUserId: string,
    data: UpdatePatientDto,
  ): Promise<PatientResponseDto> {
    if (id !== currentUserId) {
      throw new ForbiddenException(
        'You do not have permission to update this profile',
      );
    }

    const patient = await this.prisma.patient.findUnique({
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

    if (!patient) {
      throw new NotFoundException(`Patient not found`);
    }

    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      data.password = hashedPassword;
    }

    const updatedPatient = await this.prisma.patient.update({
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

    return new PatientResponseDto(updatedPatient);
  }

  async removePatient(id: string, currentUserId: string): Promise<void> {
    if (id !== currentUserId) {
      throw new ForbiddenException(
        'You do not have permission to remove this profile',
      );
    }

    const patient = await this.prisma.patient.findUnique({
      where: { id },
    });

    if (!patient) {
      throw new NotFoundException(`Patient not found`);
    }

    await this.prisma.patient.delete({
      where: { id },
    });
  }
}
