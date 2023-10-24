import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './guards/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './guards/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '30d' }, // "10h", "7d"
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy]
})
export class AuthModule { }
