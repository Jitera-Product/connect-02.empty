
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { UserRepository } from 'src/repositories/users.repository';
import { User } from 'src/entities/users';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async verifyEmail(usernameOrEmail: string, verificationToken: string): Promise<{ verified: boolean; message?: string }> {
    // Step 1: Use the "UserRepository" to find a user by "username_or_email".
    const user = await this.userRepository.findOne({
      where: {
        username_or_email: usernameOrEmail,
      },
    });

    // Step 2: If no user is found, throw a "NotFoundException".
    if (!user) {
      throw new NotFoundException('User does not exist.');
    }

    // Step 3: If a user is found, compare the provided "verification_token" with the one stored in the database.
    // Step 4: If the tokens match, update the user's "verified" status to true.
    if (user.verification_token === verificationToken) {
      user.verified = true;
      await this.userRepository.save(user);
    } else {
      // Step 5: If the tokens do not match, throw a "BadRequestException".
      throw a BadRequestException('Verification has failed.');
    }

    // Step 6: Return an object with a "verified" property set to true if the verification is successful.
    return { verified: true, message: 'Email verification successful.' };
  }

  // ... other methods in AuthService ...
}
