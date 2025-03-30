import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { UsersModule } from './module/v1/users/users.module';
import { AuthService } from './module/v1/auth/auth.service';
import { AuthModule } from './module/v1/auth/auth.module';
import { PrismaModule } from './module/common/prisma/prisma.module';
import { CustomLoggerModule } from './module/common/custom-logger/custom-logger.module';
import { JwtStrategy } from './module/v1/auth/strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().required(),
        PORT: Joi.number().default(3001),
      }),
    }),
    CustomLoggerModule,
    AuthModule,
    UsersModule,
    PrismaModule,
    CustomLoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
