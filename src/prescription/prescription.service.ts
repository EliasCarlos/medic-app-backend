import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { join } from 'path';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import { UserRole } from 'src/shared/types/userRoles-types';

@Injectable()
export class PrescriptionService {
  constructor(private prisma: PrismaService) {}

  async create(
    data: CreatePrescriptionDto,
    userId: string,
    file?: Express.Multer.File,
  ) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: data.appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.doctorId !== userId) {
      throw new ForbiddenException(
        'You can only create prescriptions for your own appointments',
      );
    }

    const fileName = `prescription-${Date.now()}.pdf`;
    const pdfPath = join(process.cwd(), 'uploads', fileName);

    await this.generatePdf(data, pdfPath);

    return this.prisma.prescription.create({
      data: {
        ...data,
        file: file ? file.filename : fileName,
        date: data.date ? new Date(data.date) : new Date(),
      },
    });
  }

  async findAll(userId: string, role: UserRole) {
    return this.prisma.prescription.findMany({
      where: {
        appointment:
          role === 'doctor' ? { doctorId: userId } : { patientId: userId },
      },
      include: { appointment: true },
    });
  }

  async findOne(id: string, userId: string) {
    const prescription = await this.prisma.prescription.findUnique({
      where: { id },
      include: { appointment: true },
    });

    if (!prescription) {
      throw new NotFoundException('Prescription not found');
    }

    if (
      prescription.appointment.doctorId !== userId &&
      prescription.appointment.patientId !== userId
    ) {
      throw new ForbiddenException(
        'You do not have permission to view this prescription',
      );
    }

    return prescription;
  }

  async update(id: string, userId: string, data: UpdatePrescriptionDto) {
    const prescription = await this.findOne(id, userId);

    if (prescription.appointment.doctorId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this prescription',
      );
    }

    if (prescription.file) {
      const oldPath = join(process.cwd(), 'uploads', prescription.file);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const fileName = `prescription-${Date.now()}.pdf`;
    const pdfPath = join(process.cwd(), 'uploads', fileName);
    await this.generatePdf(data, pdfPath);

    return this.prisma.prescription.update({
      where: { id },
      data: {
        ...data,
        file: fileName,
        updatedAt: new Date(),
      },
    });
  }

  async remove(id: string, userId: string) {
    const prescription = await this.findOne(id, userId);

    if (prescription.appointment.doctorId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to remove this prescription',
      );
    }

    if (prescription.file) {
      const filePath = join(process.cwd(), 'uploads', prescription.file);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    return this.prisma.prescription.delete({
      where: { id },
    });
  }

  async download(id: string, userId: string, res: any) {
    const prescription = await this.prisma.prescription.findUnique({
      where: { id },
      include: { appointment: true },
    });

    if (!prescription || !prescription.file) {
      throw new NotFoundException('File not found in database');
    }

    if (
      prescription.appointment.doctorId !== userId &&
      prescription.appointment.patientId !== userId
    ) {
      throw new ForbiddenException(
        'You do not have permission to download this prescription',
      );
    }

    const filePath = join(process.cwd(), 'uploads', prescription.file);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File not found on disk');
    }

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${prescription.file}`,
    });

    fs.createReadStream(filePath).pipe(res);
  }

  private async generatePdf(
    data: CreatePrescriptionDto | UpdatePrescriptionDto,
    path: string,
  ) {
    return new Promise<void>((resolve, reject) => {
      const doc = new PDFDocument();
      const stream = doc.pipe(fs.createWriteStream(path));

      doc.fontSize(20).text('Prescription', { align: 'center' });
      doc.moveDown();
      if (data.medicine) doc.text(`Medicine: ${data.medicine}`);
      if (data.dosage) doc.text(`Dosage: ${data.dosage}`);
      if (data.instructions) doc.text(`Instructions: ${data.instructions}`);

      doc.end();

      stream.on('finish', () => resolve());
      stream.on('error', (err) => reject(err));
    });
  }
}
