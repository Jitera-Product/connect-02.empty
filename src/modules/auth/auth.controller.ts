import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VerifyEmailDto } from './dtos/verify-email.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}
