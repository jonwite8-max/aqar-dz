import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import nodemailer from 'nodemailer';

@Injectable()
export class OtpDeliveryService {
  async sendEmail(email: string, code: string): Promise<{ devCode: string | null }> {
    const isProduction = process.env.NODE_ENV === 'production';
    const devEcho = process.env.OTP_DEV_ECHO === 'true';
    if (isProduction && devEcho) throw new Error('OTP_DEV_ECHO must be false in production');
    if (devEcho) return { devCode: code };

    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASSWORD;
    const from = process.env.SMTP_FROM;
    if (!host || !user || !pass || !from) throw new ServiceUnavailableException('OTP delivery provider is not configured');

    const transport = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user, pass },
    });
    await transport.sendMail({ from, to: email, subject: 'رمز الدخول إلى عقارات DZ', text: `رمز التحقق الخاص بك هو: ${code}\nينتهي خلال 10 دقائق.` });
    return { devCode: null };
  }
}
