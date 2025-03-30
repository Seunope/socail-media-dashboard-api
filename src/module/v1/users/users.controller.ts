import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from '@prisma/client';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  @Get('dashboard')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  getAdminDashboard() {
    return { message: 'Admin dashboard' };
  }

  @Get('super-secret')
  @Roles(Role.SUPER_ADMIN)
  getSuperAdminData() {
    return { message: 'Super admin only data' };
  }
}
