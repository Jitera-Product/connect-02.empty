
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RegisterUserDto } from './dtos/register-user.dto'
import { EmailService } from 'src/shared/email/email.service'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { AuthService } from './auth.service'
import { UserEntity } from './entities/user.entity'
import { TokenStrategy } from './strategies/token.strategy'
import { OAuthController } from './controllers/oauth.controller'
import { OAuthService } from './services/oauth.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
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
    RegisterUserDto,
  ],
  providers: [
    AuthService,
    TokenStrategy,
    OAuthService,
    {
      provide: 'EmailServiceInterface',
      useClass: EmailService,
    },
  ],
})
export class AuthModule {}
