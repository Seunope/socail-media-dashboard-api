import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { CustomLoggerService } from '../custom-logger/custom-logger.service';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    private configService: ConfigService,
    private logger: CustomLoggerService,
  ) {
    super({
      datasources: {
        db: {
          url: configService.get<string>('DATABASE_URL'),
        },
      },
    });
  }

  async onModuleInit() {
    const maxRetries = 3;
    let retries = 0;

    while (retries < maxRetries) {
      try {
        await this.$connect();
        this.logger.log('Database connection established successfully');
        break;
      } catch (error) {
        retries++;
        this.logger.warn(
          `Failed to connect to the database (attempt ${retries}/${maxRetries})`,
        );
        if (retries === maxRetries) {
          this.logger.error('Max retries reached. Giving up.', error.stack);
          throw error;
        }
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
      }
    }

    // try {
    //   await this.$connect();
    //   this.logger.log('Database connection established successfully');
    // } catch (error) {
    //   this.logger.error('Failed to connect to the database', error.stack);
    //   throw error;
    // }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('Database connection closed successfully');
    } catch (error) {
      this.logger.error('Failed to disconnect from the database', error.stack);
    }
  }
}
