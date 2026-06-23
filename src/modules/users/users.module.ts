import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [UsersService, UsersResolver],
  imports: [PrismaModule],
})
export class UsersModule {}
