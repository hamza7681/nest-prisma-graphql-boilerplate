import { Module } from '@nestjs/common';

import { PermissionsResolver } from './permissions.resolver';
import { PermissionsService } from './permissions.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [PermissionsService, PermissionsResolver],
  imports: [PrismaModule],
})
export class PermissionsModule {}
