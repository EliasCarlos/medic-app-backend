import {
  Body,
  Controller,
  Delete,
  Get,
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
  async createDoctor(
    @Body() data: CreateDoctorDto,
  ): Promise<DoctorResponseDto> {
    return this.doctorService.create(data);
  }

  @Get()
  async findAllDoctors(): Promise<DoctorResponseDto[]> {
    return this.doctorService.findAll();
  }

  @Get(':id')
  async findDoctorById(@Param('id') id: string): Promise<DoctorResponseDto> {
    return this.doctorService.findById(id);
  }

  @Patch(':id')
  async updateDoctor(
    @Param('id') id: string,
    @Body() data: UpdateDoctorDto,
  ): Promise<DoctorResponseDto> {
    return this.doctorService.updateDoctor(id, data);
  }

  @Delete(':id')
  async removeDoctor(@Param('id') id: string): Promise<void> {
    return this.doctorService.removeDoctor(id);
  }
}
