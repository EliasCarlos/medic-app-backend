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
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentResponseDto } from './dto/appointment-response.dto';

@ApiTags('Appointments')
@Controller('appointment')
export class AppointmentController {
  constructor(private appointmentService: AppointmentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new appointment' })
  @ApiBody({ type: CreateAppointmentDto })
  @ApiResponse({
    status: 201,
    description: 'Appointment created successfully',
    type: AppointmentResponseDto,
  })
  create(@Body() data: CreateAppointmentDto) {
    return this.appointmentService.create(data);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List all appointments' })
  @ApiResponse({
    status: 200,
    description: 'Appointment list returned successfully',
    type: [AppointmentResponseDto],
  })
  findAll() {
    return this.appointmentService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Search appointment by ID' })
  @ApiResponse({
    status: 200,
    description: 'Appointment found',
    type: AppointmentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  findById(@Param('id') id: string) {
    return this.appointmentService.findById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update appointment data' })
  @ApiBody({ type: UpdateAppointmentDto })
  @ApiResponse({
    status: 200,
    description: 'Appointment successfully updated',
    type: AppointmentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  update(@Param('id') id: string, @Body() data: UpdateAppointmentDto) {
    return this.appointmentService.updateAppointment(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove appointment by ID' })
  @ApiResponse({
    status: 204,
    description: 'Appointment successfully removed',
  })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  remove(@Param('id') id: string) {
    return this.appointmentService.remove(id);
  }
}
