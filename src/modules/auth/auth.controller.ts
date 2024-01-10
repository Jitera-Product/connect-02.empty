import { Body, Controller, HttpCode, HttpStatus, Post, BadRequestException, NotFoundException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RegisterUserDto } from './dtos/register-user.dto';
import { VerifyEmailDto } from './dtos/verify-email.dto';
import { AuthService } from './auth.service';

interface RegistrationResponse {
  status: number;
  message: string;
  user?: {
    id: number;
    username_or_email: string;
    firstname: string;
    lastname: string;
  };
}

interface ErrorResponse {
  statusCode: number;
  message: string;
}

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-verification-email')
  @HttpCode(HttpStatus.OK)
  async sendVerificationEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    try {
      const result = await this.authService.sendVerificationEmail(verifyEmailDto.usernameOrEmail);
      return {
        status: HttpStatus.OK,
        message: "Verification email sent successfully."
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException("Email address not found.");
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException("Invalid email format.");
      } else {
        throw new Error("An unexpected error occurred on the server.");
      }
    }
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    const result = await this.authService.verifyEmail(verifyEmailDto.username_or_email, verifyEmailDto.verification_token);
    if (result.success) {
      return { status: 'verified' };
    } else {
      return { status: 'verification failed', message: result.message };
    }
  }

  @Post('/api/users/signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() registerUserDto: RegisterUserDto): Promise<RegistrationResponse | ErrorResponse> {
    try {
      const result = await this.authService.registerUser(
        registerUserDto.username_or_email,
        registerUserDto.password,
        registerUserDto.firstname,
        registerUserDto.lastname,
      );

      return {
        status: HttpStatus.CREATED,
        message: "User registered successfully.",
        user: {
          id: result.userId,
          username_or_email: registerUserDto.username_or_email,
          firstname: registerUserDto.firstname,
          lastname: registerUserDto.lastname,
        },
      };
    } catch (error) {
      return { statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR, message: error.response || error.message };
    }
  }
}
