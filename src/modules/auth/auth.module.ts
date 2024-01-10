import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { EmailService } from '../../shared/email/email.service'; // Adjusted import path
import { UserRepository } from '../../repositories/users.repository';
import { User } from '../../entities/users'; // Adjusted import path
import { TokenStrategy } from './strategies/token.strategy';
import { OAuthController } from './controllers/oauth.controller';
import { OAuthService } from './services/oauth.service';
import { RegisterUserDto } from './dtos/register-user.dto'; // Adjusted import path
import { UserEntity } from './entities/user.entity'; // Adjusted import path

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserEntity]), // Combined User and UserEntity
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '60s' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    OAuthController,
    RegisterUserDto, // Kept RegisterUserDto as a controller (assuming it was intended to be a controller)
  ],
  providers: [
    AuthService,
    EmailService, // Kept EmailService as a provider
    UserRepository, // Added UserRepository from new code
    TokenStrategy,
    OAuthService,
    {
      provide: 'EmailServiceInterface',
      useClass: EmailService,
    },
  ],
  exports: [AuthService], // Exported AuthService as per new code
})
export class AuthModule {}
