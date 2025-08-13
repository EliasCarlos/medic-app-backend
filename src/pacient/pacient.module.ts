import { Module } from '@nestjs/common';
import { PacientController } from './pacient.controller';
import { PacientService } from './pacient.service';

@Module({
  controllers: [PacientController],
  providers: [PacientService]
})
export class PacientModule {}
