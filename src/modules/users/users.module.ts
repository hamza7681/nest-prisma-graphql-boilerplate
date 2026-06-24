import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthStrategy } from 'src/strategies/auth.strategy';

import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { CommonModule } from '../common/common.module';
import { EmailModule } from '../email/email.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [UsersService, UsersResolver, AuthStrategy],
  imports: [
    PrismaModule,
    CommonModule,
    EmailModule,
    PassportModule,
    JwtModule.register({ secret: process.env.JWT_SECRET! }),
  ],
})
export class UsersModule {}
