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
import { PacientService } from './pacient.service';
import { CreatePacientDto } from './dto/create-pacient.dto';
import { PacientResponseDto } from './dto/pacient-response.dto';
import { UpdatePacientDto } from './dto/update-pacient.dto';

@Controller('pacient')
export class PacientController {
  constructor(private pacientService: PacientService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPacient(
    @Body() data: CreatePacientDto,
  ): Promise<PacientResponseDto> {
    return this.pacientService.create(data);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAllPacients(): Promise<PacientResponseDto[]> {
    return this.pacientService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findPacientById(@Param('id') id: string): Promise<PacientResponseDto> {
    return this.pacientService.findById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updatePacient(
    @Param('id') id: string,
    @Body() data: UpdatePacientDto,
  ): Promise<PacientResponseDto> {
    return this.pacientService.updatePacient(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removePacient(@Param('id') id: string): Promise<void> {
    return this.pacientService.removePacient(id);
  }
}
