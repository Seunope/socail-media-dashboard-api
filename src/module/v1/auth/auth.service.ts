// auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User, Role } from '@prisma/client';
import { PrismaService } from 'src/module/common/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateOAuthLogin(userProfile: any, provider: string): Promise<any> {
    let user: User;

    if (provider === 'facebook') {
      user = await this.prisma.user.upsert({
        where: { facebookId: userProfile.facebookId },
        update: {
          email: userProfile.email,
          name: `${userProfile.firstName} ${userProfile.lastName}`,
        },
        create: {
          facebookId: userProfile.facebookId,
          email: userProfile.email,
          name: `${userProfile.firstName} ${userProfile.lastName}`,
          role: Role.USER,
        },
      });
    } else if (provider === 'instagram') {
      user = await this.prisma.user.upsert({
        where: { instagramId: userProfile.instagramId },
        update: {
          name: userProfile.username,
        },
        create: {
          instagramId: userProfile.instagramId,
          name: userProfile.username,
          role: Role.USER,
        },
      });
    }

    if (!user) {
      throw new UnauthorizedException('Failed to create or update user');
    }

    return this.generateJwtToken(user);
  }

  async validateUserById(userId: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async generateJwtToken(user: {
    id: any;
    email?: string;
    role: string;
  }): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
    });
  }

  async promoteToAdmin(userId: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { role: Role.ADMIN },
    });
  }

  async promoteToSuperAdmin(userId: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { role: Role.SUPER_ADMIN },
    });
  }
}
