import { authenticator } from 'otplib';

export function generateTotpSecret() {
  return authenticator.generateSecret();
}

export function generateOtpAuthUrl(user: string, issuer: string, secret: string) {
  return authenticator.keyuri(user, issuer, secret);
}

export function verifyTotp(token: string, secret: string): boolean {
  return authenticator.verify({ token, secret });
}
