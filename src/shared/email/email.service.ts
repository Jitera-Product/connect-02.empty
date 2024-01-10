import { ISendMailOptions } from '@nestjs-modules/mailer'
import { InjectQueue } from '@nestjs/bull'
import { Injectable, Logger } from '@nestjs/common'
import { Queue } from 'bull'
import { MAIL_QUEUE, SEND_MAIL_JOB } from './email.constants'
import { User } from '../../entities/users.ts' // Assuming the path to the User entity is correct

@Injectable()
export class EmailService {
  constructor(@InjectQueue(MAIL_QUEUE) private readonly mailQueue: Queue) {}

  private logger = new Logger(EmailService.name)

  async sendVerificationEmail(user: User, token: string) {
    const emailOptions: ISendMailOptions = {
      to: user.username_or_email,
      subject: 'Email Confirmation',
      template: './email-confirmation', // Path to the email template
      context: {
        token,
        welcome: 'Welcome to our service!',
        body: 'Please confirm your email address by clicking the link below:',
        link: 'Confirm Email',
        url: 'http://yourdomain.com/verify-email' // Replace with your frontend URL for email verification
      },
    };
    return this.sendMail(emailOptions);
  }

  async sendMail(options: ISendMailOptions) {
    try {
      if (process.env.NODE_ENV === 'test') {
        return true
      }

      await this.mailQueue.add(SEND_MAIL_JOB, options)
      return true
    } catch (e) {
      this.logger.error('An error occur while adding send mail job', e)
      return false
    }
  }
}
