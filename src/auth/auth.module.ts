import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { AuthGuard } from './auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [
    LoggerModule,
    UsersModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('verify.secret'),
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
