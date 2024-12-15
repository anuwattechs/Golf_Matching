export interface SocialInterface {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  facebookId?: string | null; // Optional property for Facebook ID
  googleId?: string | null; // Optional property for Google ID
  appleId?: string | null; // Optional property for Apple ID
}
