import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaModule } from 'src/shared/database/prisma.module';
import { HashingModule } from 'src/shared/hashing/hashing.module';

@Module({
  imports: [PrismaModule, HashingModule],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
