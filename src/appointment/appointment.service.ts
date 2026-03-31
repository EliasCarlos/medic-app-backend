import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentResponseDto } from './dto/appointment-response.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { UserRole } from 'src/shared/types/userRoles-types';
import { APPOINTMENT_SELECT } from 'src/shared/database/prisma.selects';

@Injectable()
export class AppointmentService {
  constructor(private prisma: PrismaService) {}

  async create(
    data: CreateAppointmentDto,
    userId: string,
    role: UserRole,
  ): Promise<AppointmentResponseDto> {
    if (role === 'doctor' && data.doctorId !== userId) {
      throw new ForbiddenException(
        'A doctor can only create appointments for themselves',
      );
    }
    if (role === 'patient' && data.patientId !== userId) {
      throw new ForbiddenException(
        'A patient can only create appointments for themselves',
      );
    }

    const conflict = await this.prisma.appointment.findFirst({
      where: {
        doctorId: data.doctorId,
        date: new Date(data.date),
      },
    });

    if (conflict) {
      throw new BadRequestException('Appointment already exists at this time');
    }

    const appointment = await this.prisma.appointment.create({
      data: {
        date: new Date(data.date),
        doctorId: data.doctorId,
        patientId: data.patientId,
      },
      select: APPOINTMENT_SELECT,
    });

    return new AppointmentResponseDto(appointment);
  }

  async findAll(
    userId: string,
    role: UserRole,
  ): Promise<AppointmentResponseDto[]> {
    const appointments = await this.prisma.appointment.findMany({
      where: role === 'doctor' ? { doctorId: userId } : { patientId: userId },
      orderBy: { date: 'asc' },
      select: APPOINTMENT_SELECT,
    });

    return appointments.map((a) => new AppointmentResponseDto(a));
  }

  async findById(
    id: string,
    userId: string,
    role: UserRole,
  ): Promise<AppointmentResponseDto> {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      select: APPOINTMENT_SELECT,
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.doctorId !== userId && appointment.patientId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to view this appointment',
      );
    }

    return new AppointmentResponseDto(appointment);
  }

  async updateAppointment(
    id: string,
    userId: string,
    role: UserRole,
    data: UpdateAppointmentDto,
  ): Promise<AppointmentResponseDto> {
    const appointment = await this.findById(id, userId, role);

    const updated = await this.prisma.appointment.update({
      where: { id },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : appointment.date,
      },
      select: APPOINTMENT_SELECT,
    });

    return new AppointmentResponseDto(updated);
  }

  async remove(id: string, userId: string): Promise<void> {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.doctorId !== userId && appointment.patientId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to remove this appointment',
      );
    }

    await this.prisma.appointment.delete({ where: { id } });
  }
}
