
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { UserRepository } from 'src/repositories/users.repository';
import { EmailService } from 'src/shared/email/email.service';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { User } from 'src/entities/users';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService, // Optional chaining removed as EmailService is now required
  ) {}

  async registerUser(
    username_or_email: string,
    password: string,
    firstname: string,
    lastname: string,
  ): Promise<{ userId: number; status: string; error?: string }> {
    // Validation checks
    if (!username_or_email || !password || !firstname || !lastname || password.length < 10 || !/^[a-zA-Z0-9]*$/.test(password)) {
      throw new BadRequestException('All fields are required and password must be at least 10 characters long and contain alphanumeric characters');
    }

    if (!/^[a-zA-Z0-9]+$/.test(username_or_email)) {
      throw new BadRequestException('Username or email must contain only alphanumeric characters');
    }

    const isUnique = await this.userRepository.findOneBy({ username_or_email });
    if (isUnique) {
      throw new BadRequestException('Username or email already exists');
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = new User();
    user.username_or_email = username_or_email;
    user.password = encryptedPassword;
    user.firstname = firstname;
    user.lastname = lastname;
    // Assuming there is a column for verification status which is not mentioned in ERD
    user.is_verified = false; // Uncomment if the column exists

    const newUser = await this.userRepository.save(user);

    const verificationToken = crypto.randomBytes(32).toString('hex');
    // Assuming there is a method to save the verification token which is not mentioned in ERD
    // await this.saveVerificationToken(newUser.id, verificationToken);

    // Send a verification email using EmailService
    const emailSent = await this.emailService.sendVerificationEmail(newUser, verificationToken);

    if (!emailSent) {
      throw new BadRequestException('Failed to send verification email');
    }

    return {
      userId: newUser.id,
      status: 'Registration successful, verification email sent',
    };
  }

  async verifyEmail(usernameOrEmail: string, verificationToken: string): Promise<{ verified: boolean; message?: string }> {
    const user = await this.userRepository.findOne({
      where: {
        username_or_email: usernameOrEmail,
      },
    });

    if (!user) {
      throw new NotFoundException('User does not exist.');
    }

    if (user.verification_token === verificationToken) {
      user.verified = true;
      await this.userRepository.save(user);
    } else {
      throw a BadRequestException('Verification has failed.');
    }

    return { verified: true, message: 'Email verification successful.' };
  }

  // ... other methods in AuthService ...
}
