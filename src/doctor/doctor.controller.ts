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
} from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { DoctorResponseDto } from './dto/doctor-response.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Controller('doctor')
export class DoctorController {
  constructor(private doctorService: DoctorService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createDoctor(
    @Body() data: CreateDoctorDto,
  ): Promise<DoctorResponseDto> {
    return this.doctorService.create(data);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAllDoctors(): Promise<DoctorResponseDto[]> {
    return this.doctorService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findDoctorById(@Param('id') id: string): Promise<DoctorResponseDto> {
    return this.doctorService.findById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateDoctor(
    @Param('id') id: string,
    @Body() data: UpdateDoctorDto,
  ): Promise<DoctorResponseDto> {
    return this.doctorService.updateDoctor(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeDoctor(@Param('id') id: string): Promise<void> {
    return this.doctorService.removeDoctor(id);
  }
}
