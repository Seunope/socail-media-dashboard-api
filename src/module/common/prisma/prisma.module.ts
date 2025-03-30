import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CustomLoggerService } from '../custom-logger/custom-logger.service';

@Module({
  // imports: [CustomLoggerService],
  providers: [PrismaService, CustomLoggerService],
  exports: [PrismaService],
})
export class PrismaModule {}
