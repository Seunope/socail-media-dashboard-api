// strategies/instagram.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy as OAuth2Strategy,
  InternalOAuthError,
} from 'passport-oauth2';
import { AuthService } from '../auth.service';

@Injectable()
export class InstagramOAuthStrategy extends PassportStrategy(
  OAuth2Strategy,
  'instagram',
) {
  constructor(private authService: AuthService) {
    super({
      authorizationURL: 'https://api.instagram.com/oauth/authorize',
      tokenURL: 'https://api.instagram.com/oauth/access_token',
      clientID: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
      callbackURL: process.env.INSTAGRAM_CALLBACK_URL,
      scope: ['user_profile'],
      state: true,
    });

    // Bind the userProfile method to maintain proper 'this' context
    this.userProfile = this.userProfile.bind(this);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (error: any, user?: any) => void,
  ) {
    try {
      const user = {
        instagramId: profile.id,
        username: profile.username,
        accessToken,
      };

      const result = await this.authService.validateOAuthLogin(
        user,
        'instagram',
      );
      return done(null, result);
    } catch (err) {
      return done(err, false);
    }
  }

  userProfile(
    accessToken: string,
    done: (err?: Error | null, profile?: any) => void,
  ): void {
    // Use the OAuth2 instance from the strategy
    (this as any)._oauth2.get(
      'https://graph.instagram.com/me?fields=id,username',
      accessToken,
      (err: Error, body: string) => {
        if (err) {
          return done(
            new InternalOAuthError('Failed to fetch user profile', err),
          );
        }

        try {
          const json = JSON.parse(body);
          const profile = {
            provider: 'instagram',
            id: json.id,
            username: json.username,
            _json: json,
          };
          done(null, profile);
        } catch (e) {
          done(e as Error);
        }
      },
    );
  }
}
