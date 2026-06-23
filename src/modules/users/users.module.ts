import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { CommonModule } from '../common/common.module';
import { EmailModule } from '../email/email.module';

@Module({
  providers: [UsersService, UsersResolver],
  imports: [PrismaModule, CommonModule, EmailModule],
})
export class UsersModule {}
