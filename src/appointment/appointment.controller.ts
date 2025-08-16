import {
  Body,
  Controller,
  Delete,
  Get,
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
  create(@Body() data: CreateAppointmentDto) {
    return this.appointmentService.create(data);
  }

  @Get()
  findAll() {
    return this.appointmentService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.appointmentService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateAppointmentDto) {
    return this.appointmentService.upatedAppointment(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentService.remove(id);
  }
}
