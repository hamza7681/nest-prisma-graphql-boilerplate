import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

import { PERMISSION_KEY } from 'src/decorators/require-permission.decorator';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CurrentUser } from 'src/types/user';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    //  Read required permission from decorator
    const requiredPermission = this.reflector.getAllAndOverride<string>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    //  No decorator = public resolver, skip guard
    if (!requiredPermission) return true;

    //  Get logged in user from GQL context
    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext<{ req: { user: CurrentUser } }>().req.user;

    if (!user) throw new UnauthorizedException('Not authenticated');

    // 4. Fetch role + permissions from DB
    const membership = await this.prisma.membership.findUnique({
      where: {
        userId_organizationId: {
          userId: user.userId,
          organizationId: user.organizationId,
        },
      },
      select: {
        role: {
          select: {
            name: true,
            permissions: {
              select: {
                permission: { select: { key: true } },
              },
            },
          },
        },
      },
    });

    if (!membership) throw new ForbiddenException('No membership found');

    //  Check if role has required permission
    const hasPermission = membership.role.permissions.some(
      (rp) => rp.permission.key === requiredPermission,
    );

    if (!hasPermission)
      throw new ForbiddenException(
        "You don't have permissions to perform this action.",
      );

    return true;
  }
}
