import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

import { PERMISSIONS_KEY } from 'src/decorators/permissions.decorator';
import { ROLES_KEY } from 'src/decorators/roles.decorator';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CurrentUser, RoleType } from 'src/types/user';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles && !requiredPermissions) return true;

    const ctx = GqlExecutionContext.create(context);

    const user = ctx.getContext<{ user: CurrentUser }>().user;

    if (!user) return false;

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

    if (!membership) return false;

    const userRole = membership.role.name;

    const userPermissions = membership.role.permissions.map(
      (permission) => permission.permission.key,
    );

    if (requiredRoles?.length) {
      const hasRole = requiredRoles.includes(userRole);

      if (!hasRole)
        throw new ForbiddenException(
          'You do not have the required role to access this resource',
        );
    }

    if (requiredPermissions?.length) {
      const hasPermission = requiredPermissions.every((permission) =>
        userPermissions.includes(permission),
      );

      if (!hasPermission)
        throw new ForbiddenException(
          'You do not have the required permissions to access this resource',
        );
    }

    return true;
  }
}
