import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CommonService } from './common.service';

@Module({
  providers: [CommonService, JwtService],
  exports: [CommonService],
})
export class CommonModule {}
