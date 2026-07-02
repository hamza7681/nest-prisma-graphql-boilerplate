import { Module } from '@nestjs/common';

import { RolesResolver } from './roles.resolver';
import { RolesService } from './roles.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [RolesService, RolesResolver],
  imports: [PrismaModule],
})
export class RolesModule {}
