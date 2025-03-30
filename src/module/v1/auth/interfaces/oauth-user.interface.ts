export interface OAuthUser {
  id?: string;
  facebookId?: string;
  instagramId?: string;
  email?: string;
  role?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  accessToken: string;
  refreshToken?: string;
}
