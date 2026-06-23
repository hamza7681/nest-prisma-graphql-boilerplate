import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail({
    to,
    name,
    token,
  }: {
    to: string;
    name: string;
    token: string;
  }): Promise<void> {
    const confirmationUrl = `${process.env.FRONTEND_URL}/confirm-account/${token}`;

    await this.mailerService.sendMail({
      to,
      subject: 'Welcome to Nest Prisma GraphQL Boilerplate',
      template: 'welcome',
      context: {
        name,
        confirmationUrl,
      },
    });
  }
}
