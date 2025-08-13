import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { DoctorResponseDto } from './dto/doctor-response.dto';
import * as bcrypt from 'bcrypt';
import { DoctorSelect } from 'src/shared/types/prisma-types';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Injectable()
export class DoctorService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateDoctorDto): Promise<DoctorResponseDto> {
    const existingDoctor = await this.prisma.doctor.findUnique({
      where: { medicalRegistration: data.medicalRegistration },
    });

    if (existingDoctor) {
      throw new BadRequestException(
        'A doctor with this medical registration already exists.',
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const doctor = await this.prisma.doctor.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        medicalSpecialty: true,
        medicalRegistration: true,
        email: true,
        phone: true,
      },
    });

    return doctor;
  }

  async findAll(): Promise<DoctorResponseDto[]> {
    const doctors: DoctorSelect[] = await this.prisma.doctor.findMany({
      select: {
        id: true,
        name: true,
        medicalSpecialty: true,
        medicalRegistration: true,
        email: true,
        phone: true,
      },
    });
    return doctors.map((doctor) => new DoctorResponseDto(doctor));
  }

  async findById(id: string): Promise<DoctorResponseDto> {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        medicalSpecialty: true,
        medicalRegistration: true,
        email: true,
        phone: true,
      },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    return new DoctorResponseDto(doctor);
  }

  async updateDoctor(
    id: string,
    data: UpdateDoctorDto,
  ): Promise<DoctorResponseDto> {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        medicalSpecialty: true,
        medicalRegistration: true,
        email: true,
        phone: true,
      },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      data.password = hashedPassword;
    }

    const updatedDoctor = await this.prisma.doctor.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        medicalSpecialty: true,
        medicalRegistration: true,
        email: true,
        phone: true,
      },
    });

    return new DoctorResponseDto(updatedDoctor);
  }

  async removeDoctor(id: string): Promise<void> {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    await this.prisma.doctor.delete({
      where: { id },
    });
  }
}
