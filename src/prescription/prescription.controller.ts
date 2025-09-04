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
} from '@nestjs/common';
import { Response } from 'express';
import { PrescriptionService } from './prescription.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { Roles } from 'src/shared/decorators/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Prescriptions')
@Controller('prescription')
export class PrescriptionController {
  constructor(private prescriptionService: PrescriptionService) {}

  @Roles('doctor')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new prescription' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'Prescription created successfully',
    type: CreatePrescriptionDto,
  })
  async create(
    @Body() data: CreatePrescriptionDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.prescriptionService.create(data, file);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List all prescriptions' })
  @ApiResponse({
    status: 200,
    description: 'Prescription list returned successfully',
    type: [CreatePrescriptionDto],
  })
  async findAll() {
    return this.prescriptionService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Search for a prescription by ID' })
  @ApiParam({ name: 'id', description: 'Prescription ID', type: String })
  @ApiResponse({
    status: 200,
    description: 'Prescription successfully found',
    type: CreatePrescriptionDto,
  })
  async findOne(@Param('id') id: string) {
    return this.prescriptionService.findOne(id);
  }

  @Roles('doctor')
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a prescription by ID' })
  @ApiParam({ name: 'id', description: 'Prescription ID', type: String })
  @ApiResponse({
    status: 200,
    description: 'Prescription updated successfully',
    type: UpdatePrescriptionDto,
  })
  async update(@Param('id') id: string, @Body() data: UpdatePrescriptionDto) {
    return this.prescriptionService.update(id, data);
  }

  @Roles('doctor')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a prescription by ID' })
  @ApiParam({ name: 'id', description: 'Prescription ID', type: String })
  @ApiResponse({
    status: 204,
    description: 'Prescription successfully deleted',
  })
  async remove(@Param('id') id: string) {
    return this.prescriptionService.remove(id);
  }

  @Get(':id/download')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Download the prescription file in PDF format' })
  @ApiParam({ name: 'id', description: 'Prescription ID', type: String })
  @ApiResponse({
    status: 200,
    description: 'PDF file returned successfully',
  })
  async download(@Param('id') id: string, @Res() res: Response) {
    return this.prescriptionService.download(id, res);
  }
}
