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
import { Public } from 'src/shared/decorators/public.decorator';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Doctors')
@Controller('doctor')
export class DoctorController {
  constructor(private doctorService: DoctorService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new doctor' })
  @ApiBody({ type: CreateDoctorDto })
  @ApiResponse({
    status: 201,
    description: 'Doctor created successfully',
    type: DoctorResponseDto,
  })
  async createDoctor(
    @Body() data: CreateDoctorDto,
  ): Promise<DoctorResponseDto> {
    return this.doctorService.create(data);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List all doctors' })
  @ApiResponse({
    status: 200,
    description: 'Doctor list returned successfully',
    type: [DoctorResponseDto],
  })
  async findAllDoctors(): Promise<DoctorResponseDto[]> {
    return this.doctorService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Search doctor by ID' })
  @ApiResponse({
    status: 200,
    description: 'Doctor found',
    type: DoctorResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Doctor not found' })
  async findDoctorById(@Param('id') id: string): Promise<DoctorResponseDto> {
    return this.doctorService.findById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update doctor data' })
  @ApiBody({ type: UpdateDoctorDto })
  @ApiResponse({
    status: 200,
    description: 'Doctor successfully updated',
    type: DoctorResponseDto,
  })
  async updateDoctor(
    @Param('id') id: string,
    @Body() data: UpdateDoctorDto,
  ): Promise<DoctorResponseDto> {
    return this.doctorService.updateDoctor(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove doctor by ID' })
  @ApiResponse({
    status: 204,
    description: 'Doctor successfully removed',
  })
  @ApiResponse({ status: 404, description: 'Doctor not found' })
  async removeDoctor(@Param('id') id: string): Promise<void> {
    return this.doctorService.removeDoctor(id);
  }
}
