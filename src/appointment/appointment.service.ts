import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentResponseDto } from './dto/appointment-response.dto';
import { AppointmentEntity } from 'src/shared/types/prisma-types';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateAppointmentDto): Promise<AppointmentResponseDto> {
    const conflict = await this.prisma.appointment.findFirst({
      where: {
        doctorId: data.doctorId,
        date: new Date(data.date),
      },
    });

    if (conflict) {
      throw new BadRequestException('Appointment already exists');
    }

    const appointment = await this.prisma.appointment.create({
      data: {
        date: new Date(data.date),
        doctorId: data.doctorId,
        pacientId: data.pacientId,
      },
    });

    return new AppointmentResponseDto(appointment);
  }

  async findAll(): Promise<AppointmentResponseDto[]> {
    const appointments: AppointmentEntity[] =
      await this.prisma.appointment.findMany({
        orderBy: { date: 'asc' },
      });

    return appointments.map((a) => new AppointmentResponseDto(a));
  }

  async findById(id: string): Promise<AppointmentResponseDto> {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      throw new BadRequestException('Appointment not found');
    }

    return new AppointmentResponseDto(appointment);
  }

  async upatedAppointment(
    id: string,
    data: UpdateAppointmentDto,
  ): Promise<AppointmentResponseDto> {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      throw new BadRequestException('Appointment not found');
    }

    const updated = await this.prisma.appointment.update({
      where: { id },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : appointment.date,
      },
    });

    return new AppointmentResponseDto(updated);
  }

  async remove(id: string): Promise<void> {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      throw new BadRequestException('Appointment not found');
    }

    await this.prisma.appointment.delete({ where: { id } });
  }
}
