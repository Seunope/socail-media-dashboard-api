// auth.controller.ts
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { OAuthUser } from './interfaces/oauth-user.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('facebook')
  @UseGuards(AuthGuard('facebook-token'))
  async facebookLogin(@Req() req: Request): Promise<any> {
    return req.user;
  }

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook-token'))
  async facebookLoginCallback(
    @Req() req: Request & { user: OAuthUser },
    @Res() res: Response,
  ) {
    try {
      const dbUser = await this.authService.validateOAuthLogin(
        req.user,
        'facebook',
      );

      const user = {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role || 'USER', // Default role if not provided
      };

      const token = await this.authService.generateJwtToken({
        id: dbUser.id,
        email: dbUser.email,
        role: dbUser.role,
      });

      res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
    } catch (error) {
      res.redirect(
        `${process.env.FRONTEND_URL}/login?error=authentication_failed`,
      );
    }
  }

  @Get('instagram')
  @UseGuards(AuthGuard('instagram'))
  async instagramLogin() {
    // The passport strategy will redirect to Instagram
  }

  @Get('instagram/callback')
  @UseGuards(AuthGuard('instagram'))
  async instagramLoginCallback(@Req() req: Request, @Res() res: Response) {
    const token = await this.authService.generateJwtToken(req.user as any);
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }
}
