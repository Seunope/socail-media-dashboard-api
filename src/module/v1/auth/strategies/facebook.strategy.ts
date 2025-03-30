// strategies/facebook.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as FacebookTokenStrategy } from 'passport-facebook-token';
import { AuthService } from '../auth.service';
import { OAuthUser } from '../interfaces/oauth-user.interface';

@Injectable()
export class FacebookStrategy extends PassportStrategy(
  FacebookTokenStrategy,
  'facebook-token',
) {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      fbGraphVersion: 'v12.0',
      profileFields: ['id', 'emails', 'name', 'picture.type(large)'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ) {
    try {
      const { id, emails, name, photos } = profile;
      const user: OAuthUser = {
        facebookId: profile.id,
        email: profile.emails?.[0]?.value,
        firstName: profile.name?.givenName,
        lastName: profile.name?.familyName,
        accessToken,
        refreshToken,
      };

      const result = await this.authService.validateOAuthLogin(
        user,
        'facebook',
      );
      return done(null, result);
    } catch (err) {
      return done(err, false);
    }
  }
}
