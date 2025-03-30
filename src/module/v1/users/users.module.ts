import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/module/common/prisma/prisma.service';
import { CustomLoggerService } from 'src/module/common/custom-logger/custom-logger.service';

@Module({
  providers: [UsersService, PrismaService, CustomLoggerService],
  controllers: [UsersController],
})
export class UsersModule {}
