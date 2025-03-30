import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/module/common/prisma/prisma.service';
import { CreateUserDto } from './users.dto';
import { ResponseData } from 'src/module/common/dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: CreateUserDto): Promise<ResponseData> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      throw new ConflictException({
        message: `'User with this ${data.email}data.email already exists`,
        status: false,
      });
    }
    const user = await this.prisma.user.create({ data });
    return {
      status: true,
      message: 'User created successfully',
      data: user,
    };
  }

  async userData(userId: number): Promise<ResponseData> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException({
        message: `User not found`,
        status: false,
      });
    }
    return {
      message: 'User data fetched',
      status: true,
      data: user,
    };
  }

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
