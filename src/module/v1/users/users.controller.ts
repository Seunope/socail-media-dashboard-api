import {
  Controller,
  Request,
  Post,
  Body,
  UseGuards,
  Get,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './users.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('User')
@Controller('v1/user')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @Get('data')
  async getPatientData(@Request() req): Promise<any> {
    const { userId } = req.user;
    // return await this.patientService.findOne(patientId);
    return await this.usersService.userData(userId);
  }
}
