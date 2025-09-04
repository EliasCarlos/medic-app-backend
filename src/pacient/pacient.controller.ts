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
import { PacientService } from './pacient.service';
import { CreatePacientDto } from './dto/create-pacient.dto';
import { PacientResponseDto } from './dto/pacient-response.dto';
import { UpdatePacientDto } from './dto/update-pacient.dto';
import { Public } from 'src/shared/decorators/public.decorator';

@ApiTags('Pacients')
@Controller('pacient')
export class PacientController {
  constructor(private pacientService: PacientService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new pacient' })
  @ApiBody({ type: CreatePacientDto })
  @ApiResponse({
    status: 201,
    description: 'Pacient created successfully',
    type: PacientResponseDto,
  })
  async createPacient(
    @Body() data: CreatePacientDto,
  ): Promise<PacientResponseDto> {
    return this.pacientService.create(data);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List all pacients' })
  @ApiResponse({
    status: 200,
    description: 'Pacient list returned successfully',
    type: [PacientResponseDto],
  })
  async findAllPacients(): Promise<PacientResponseDto[]> {
    return this.pacientService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Search pacient by ID' })
  @ApiResponse({
    status: 200,
    description: 'Pacient found',
    type: PacientResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Pacient not found' })
  async findPacientById(@Param('id') id: string): Promise<PacientResponseDto> {
    return this.pacientService.findById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update pacient data' })
  @ApiBody({ type: UpdatePacientDto })
  @ApiResponse({
    status: 200,
    description: 'Pacient successfully updated',
    type: PacientResponseDto,
  })
  async updatePacient(
    @Param('id') id: string,
    @Body() data: UpdatePacientDto,
  ): Promise<PacientResponseDto> {
    return this.pacientService.updatePacient(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove pacient by ID' })
  @ApiResponse({
    status: 204,
    description: 'Pacient successfully removed',
  })
  @ApiResponse({ status: 404, description: 'Pacient not found' })
  async removePacient(@Param('id') id: string): Promise<void> {
    return this.pacientService.removePacient(id);
  }
}
