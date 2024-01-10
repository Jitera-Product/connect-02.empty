
import { IsNotEmpty, IsEmail } from 'class-validator';

export class VerifyEmailDto {
  @IsNotEmpty()
  @IsEmail()
  usernameOrEmail: string;
}
