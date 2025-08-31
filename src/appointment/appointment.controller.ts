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
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Controller('appointment')
export class AppointmentController {
  constructor(private appointmentService: AppointmentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: CreateAppointmentDto) {
    return this.appointmentService.create(data);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.appointmentService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findById(@Param('id') id: string) {
    return this.appointmentService.findById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() data: UpdateAppointmentDto) {
    return this.appointmentService.updateAppointment(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.appointmentService.remove(id);
  }
}
