import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ROLES } from 'src/constants/user';

import { PrismaService } from '../prisma/prisma.service';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleResponseDto, RolesListResponseDto } from './dto/role-response.dto';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async createRole({
    data,
  }: {
    data: CreateRoleDto;
  }): Promise<RoleResponseDto> {
    const { name } = data;

    const existingRole = await this.prisma.role.findUnique({
      where: { name },
    });

    if (existingRole)
      throw new ConflictException('Role with this name already exists');

    await this.prisma.role.create({
      data: {
        name,
      },
    });

    return {
      message: 'Role created successfully',
      statusCode: 201,
    };
  }

  async getAllRoles(): Promise<RolesListResponseDto> {
    const roles = await this.prisma.role.findMany({
      include: {
        permissions: {
          include: { permission: true },
        },
      },
    });

    return {
      message: 'Roles fetched successfully',
      statusCode: 200,
      body: roles.map((role) => ({
        id: role.id,
        name: role.name,
        permissions: role.permissions.map((rp) => ({
          id: rp.permission.id,
          key: rp.permission.key,
        })),
      })),
    };
  }

  async getRoleById({ id }: { id: string }): Promise<RoleResponseDto> {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        permissions: {
          include: { permission: true },
        },
      },
    });

    if (!role) throw new NotFoundException('Role not found');

    return {
      message: 'Role fetched successfully',
      statusCode: 200,
      body: {
        id: role.id,
        name: role.name,
        permissions: role.permissions.map((rp) => ({
          id: rp.permission.id,
          key: rp.permission.key,
        })),
      },
    };
  }

  async getRoleByName({
    name,
  }: {
    name: (typeof ROLES)[keyof typeof ROLES];
  }): Promise<RoleResponseDto> {
    const role = await this.prisma.role.findUnique({
      where: { name },
      include: {
        permissions: {
          include: { permission: true },
        },
      },
    });

    if (!role) throw new NotFoundException('Role not found');

    return {
      message: 'Role fetched successfully',
      statusCode: 200,
      body: {
        id: role.id,
        name: role.name,
        permissions: role.permissions.map((rp) => ({
          id: rp.permission.id,
          key: rp.permission.key,
        })),
      },
    };
  }

  async setPermissions({
    data,
  }: {
    data: AssignPermissionsDto;
  }): Promise<RoleResponseDto> {
    const { roleId, permissionIds } = data;

    const role = await this.prisma.role.findUnique({ where: { id: roleId } });
    if (!role) throw new NotFoundException('Role not found');

    await this.prisma.$transaction([
      this.prisma.rolePermission.deleteMany({ where: { roleId } }),
      this.prisma.rolePermission.createMany({
        data: permissionIds.map((permissionId) => ({ roleId, permissionId })),
      }),
    ]);

    return {
      message: 'Role permissions updated successfully',
      statusCode: 200,
    };
  }

  async updateRoleName({
    id,
    data,
  }: {
    id: string;
    data: CreateRoleDto;
  }): Promise<RoleResponseDto> {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: { memberships: true },
    });

    if (!role) throw new NotFoundException('Role not found');

    if (role.memberships.length > 0)
      throw new BadRequestException(
        'Role is assigned to memberships and cannot be renamed',
      );

    await this.prisma.role.update({
      where: { id },
      data: { name: data.name },
    });

    return {
      message: 'Role updated successfully',
      statusCode: 200,
    };
  }

  async deleteRole({ id }: { id: string }): Promise<RoleResponseDto> {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: { memberships: true },
    });

    if (!role) throw new NotFoundException('Role not found');

    if (role.memberships.length > 0)
      throw new ConflictException(
        'Role is assigned to memberships and cannot be deleted',
      );

    await this.prisma.role.delete({ where: { id } });

    return {
      message: 'Role deleted successfully',
      statusCode: 200,
    };
  }
}
