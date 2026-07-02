import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import {
  PermissionResponseDto,
  PermissionsListResponseDto,
} from './dto/permission-response.dto';

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async createPermission({
    data,
  }: {
    data: CreatePermissionDto;
  }): Promise<PermissionResponseDto> {
    const { key, description } = data;

    const existingPermission = await this.prisma.permission.findUnique({
      where: { key },
    });

    if (existingPermission) {
      throw new Error('Permission with this key already exists');
    }

    await this.prisma.permission.create({
      data: {
        key,
        description,
      },
    });

    return {
      message: 'Permission created successfully',
      statusCode: 201,
    };
  }

  async addOrUpdateMultiplePermissions({
    data,
  }: {
    data: CreatePermissionDto[];
  }): Promise<PermissionResponseDto> {
    await Promise.all(
      data.map(({ key, description }) =>
        this.prisma.permission.upsert({
          where: { key },
          create: { key, description },
          update: { description },
        }),
      ),
    );

    return {
      message: 'Permissions updated successfully',
      statusCode: 200,
    };
  }

  async getAllPermissions(): Promise<PermissionsListResponseDto> {
    const permissions = await this.prisma.permission.findMany();

    return {
      message: 'Permissions fetched successfully',
      statusCode: 200,
      body: permissions.map((permission) => ({
        id: permission.id,
        key: permission.key,
        description: permission.description ?? null,
      })),
    };
  }

  async updatePermission({
    data,
    id: permissionId,
  }: {
    data: CreatePermissionDto;
    id: string;
  }): Promise<PermissionResponseDto> {
    const { key, description } = data;

    const existingPermission = await this.prisma.permission.findUnique({
      where: { id: permissionId },
    });

    if (!existingPermission) {
      throw new Error('Permission not found');
    }

    await this.prisma.permission.update({
      where: { id: permissionId },
      data: {
        key,
        description,
      },
    });

    return {
      message: 'Permission updated successfully',
      statusCode: 200,
    };
  }

  async getPermissionById({
    id,
  }: {
    id: string;
  }): Promise<PermissionResponseDto> {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
    });

    if (!permission) throw new NotFoundException('Permission not found');

    return {
      message: 'Permission fetched successfully',
      statusCode: 200,
      body: {
        id: permission.id,
        key: permission.key,
        description: permission.description ?? null,
      },
    };
  }

  async deletePermission({
    id,
  }: {
    id: string;
  }): Promise<PermissionResponseDto> {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
      include: { roles: true },
    });

    if (!permission) throw new NotFoundException('Permission not found');

    if (permission.roles.length > 0)
      throw new ConflictException(
        'Permission is assigned to one or more roles and cannot be deleted',
      );

    await this.prisma.permission.delete({
      where: { id },
    });

    return {
      message: 'Permission deleted successfully',
      statusCode: 200,
    };
  }
}
