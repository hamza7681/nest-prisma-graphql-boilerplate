import { Injectable } from '@nestjs/common';

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
}
