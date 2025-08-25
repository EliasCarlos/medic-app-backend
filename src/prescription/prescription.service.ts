import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { join } from 'path';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';

@Injectable()
export class PrescriptionService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePrescriptionDto, file?: Express.Multer.File) {
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

  async findAll() {
    return this.prisma.prescription.findMany();
  }

  async findOne(id: string) {
    const prescription = await this.prisma.prescription.findUnique({
      where: { id },
    });

    if (!prescription) {
      throw new NotFoundException('Prescription not found');
    }

    return prescription;
  }

  async update(id: string, data: UpdatePrescriptionDto) {
    const prescription = await this.findOne(id);

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

  async remove(id: string) {
    const prescription = await this.findOne(id);

    if (prescription.file) {
      const filePath = join(process.cwd(), 'uploads', prescription.file);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    return this.prisma.prescription.delete({
      where: { id },
    });
  }

  async download(id: string, res: any) {
    const prescription = await this.prisma.prescription.findUnique({
      where: { id },
    });

    if (!prescription || !prescription.file) {
      throw new NotFoundException('File not found in database');
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
      const stream = doc.pipe(require('fs').createWriteStream(path));

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
