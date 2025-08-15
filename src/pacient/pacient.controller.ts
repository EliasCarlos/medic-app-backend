import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PacientService } from './pacient.service';
import { CreatePacientDto } from './dto/create-pacient.dto';
import { PacientResponseDto } from './dto/pacient-response.dto';
import { UpdatePacientDto } from './dto/update-pacient.dto';

@Controller('pacient')
export class PacientController {
  constructor(private pacientService: PacientService) {}

  @Post()
  async createPacient(
    @Body() data: CreatePacientDto,
  ): Promise<PacientResponseDto> {
    return this.pacientService.create(data);
  }

  @Get()
  async findAllPacients(): Promise<PacientResponseDto[]> {
    return this.pacientService.findAll();
  }

  @Get(':id')
  async findPacientById(@Param('id') id: string): Promise<PacientResponseDto> {
    return this.pacientService.findById(id);
  }

  @Patch(':id')
  async updatePacient(
    @Param('id') id: string,
    @Body() data: UpdatePacientDto,
  ): Promise<PacientResponseDto> {
    return this.pacientService.updatePacient(id, data);
  }

  @Delete(':id')
  async removePacient(@Param('id') id: string): Promise<void> {
    return this.pacientService.removePacient(id);
  }
}
