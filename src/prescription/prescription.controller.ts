import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { PrescriptionService } from './prescription.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';

@Controller('prescription')
export class PrescriptionController {
  constructor(private prescriptionService: PrescriptionService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename(req, file, callback) {
          const randomName = Date.now() + extname(file.originalname);
          callback(null, randomName);
        },
      }),
    }),
  )
  async create(
    @Body() data: CreatePrescriptionDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.prescriptionService.create(data, file);
  }

  @Get()
  async findAll() {
    return this.prescriptionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.prescriptionService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdatePrescriptionDto) {
    return this.prescriptionService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.prescriptionService.remove(id);
  }

  @Get(':id/download')
  async download(@Param('id') id: string, @Res() res: Response) {
    return this.prescriptionService.download(id, res);
  }
}
