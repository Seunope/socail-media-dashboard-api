import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { PrismaService } from 'src/module/common/prisma/prisma.service';
import { CustomLoggerService } from 'src/module/common/custom-logger/custom-logger.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, UsersService, PrismaService, CustomLoggerService],
  controllers: [AuthController],
})
export class AuthModule {}
