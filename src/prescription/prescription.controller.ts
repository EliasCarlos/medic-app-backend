import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
import { Roles } from 'src/shared/decorators/roles.decorator';

@Controller('prescription')
export class PrescriptionController {
  constructor(private prescriptionService: PrescriptionService) {}

  @Roles('doctor')
  @Post()
  @HttpCode(HttpStatus.CREATED)
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
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.prescriptionService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return this.prescriptionService.findOne(id);
  }

  @Roles('doctor')
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() data: UpdatePrescriptionDto) {
    return this.prescriptionService.update(id, data);
  }

  @Roles('doctor')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.prescriptionService.remove(id);
  }

  @Get(':id/download')
  @HttpCode(HttpStatus.OK)
  async download(@Param('id') id: string, @Res() res: Response) {
    return this.prescriptionService.download(id, res);
  }
}
