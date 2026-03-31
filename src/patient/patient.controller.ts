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
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { PatientResponseDto } from './dto/patient-response.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Public } from 'src/shared/decorators/public.decorator';

@ApiTags('Patients')
@Controller('patient')
export class PatientController {
  constructor(private patientService: PatientService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new patient' })
  @ApiBody({ type: CreatePatientDto })
  @ApiResponse({
    status: 201,
    description: 'Patient created successfully',
    type: PatientResponseDto,
  })
  async createPatient(
    @Body() data: CreatePatientDto,
  ): Promise<PatientResponseDto> {
    return this.patientService.create(data);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List all patients' })
  @ApiResponse({
    status: 200,
    description: 'Patient list returned successfully',
    type: [PatientResponseDto],
  })
  async findAllPatients(): Promise<PatientResponseDto[]> {
    return this.patientService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Search patient by ID' })
  @ApiResponse({
    status: 200,
    description: 'Patient found',
    type: PatientResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  async findPatientById(@Param('id') id: string): Promise<PatientResponseDto> {
    return this.patientService.findById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update patient data' })
  @ApiBody({ type: UpdatePatientDto })
  @ApiResponse({
    status: 200,
    description: 'Patient successfully updated',
    type: PatientResponseDto,
  })
  async updatePatient(
    @Param('id') id: string,
    @Body() data: UpdatePatientDto,
  ): Promise<PatientResponseDto> {
    return this.patientService.updatePatient(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove patient by ID' })
  @ApiResponse({
    status: 204,
    description: 'Patient successfully removed',
  })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  async removePatient(@Param('id') id: string): Promise<void> {
    return this.patientService.removePatient(id);
  }
}
