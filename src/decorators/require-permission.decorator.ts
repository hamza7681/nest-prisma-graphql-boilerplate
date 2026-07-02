// src/decorators/require-permission.decorator.ts
import { SetMetadata } from '@nestjs/common';

import { PermissionKey } from 'src/types/user';

export const PERMISSION_KEY = 'permission';

export const RequirePermission = (permissions: PermissionKey[]) =>
  SetMetadata(PERMISSION_KEY, permissions);
