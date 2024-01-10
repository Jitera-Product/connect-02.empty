import { IsNotEmpty, IsAlphanumeric, Length, IsEmail, Matches } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format' })
  @IsAlphanumeric('en-US', { message: 'Username or email must contain only alphanumeric characters' })
  username_or_email: string;

  @IsNotEmpty()
  @Length(10, 255, { message: 'Password must be at least 10 characters long' })
  @Matches(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/, { message: 'Password must contain alphanumeric characters' })
  password: string;

  @IsNotEmpty()
  @IsAlphanumeric('en-US', { message: 'Firstname must contain only alphanumeric characters' })
  firstname: string;

  @IsNotEmpty()
  @IsAlphanumeric('en-US', { message: 'Lastname must contain only alphanumeric characters' })
  lastname: string;
}

export default RegisterUserDto;
