import { Module } from '@nestjs/common';

import { RolesResolver } from './roles.resolver';
import { RolesService } from './roles.service';

@Module({
  providers: [RolesService, RolesResolver],
})
export class RolesModule {}
