import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { PERMISSIONS } from 'src/constants/user';
import { RequirePermission } from 'src/decorators/require-permission.decorator';
import { ResponseMetadata } from 'src/decorators/response-metadata.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';

import { CreatePermissionDto } from './dto/create-permission.dto';
import {
  PermissionResponseDto,
  PermissionsListResponseDto,
} from './dto/permission-response.dto';
import { PermissionsService } from './permissions.service';

@Resolver()
@UseGuards(AuthGuard, RolesGuard)
export class PermissionsResolver {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Mutation(() => PermissionResponseDto)
  @ResponseMetadata(201, 'Permission created successfully')
  @RequirePermission(PERMISSIONS.admin.write)
  async createPermission(@Args('data') data: CreatePermissionDto) {
    return this.permissionsService.createPermission({ data });
  }

  @Query(() => PermissionsListResponseDto)
  @ResponseMetadata(200, 'Permissions fetched successfully')
  @RequirePermission(PERMISSIONS.admin.read)
  async getAllPermissions(): Promise<PermissionsListResponseDto> {
    return await this.permissionsService.getAllPermissions();
  }

  @Mutation(() => PermissionResponseDto)
  @ResponseMetadata(200, 'Permission updated successfully')
  @RequirePermission(PERMISSIONS.admin.update)
  async updatePermission(
    @Args('data') data: CreatePermissionDto,
    @Args('id') id: string,
  ): Promise<PermissionResponseDto> {
    return await this.permissionsService.updatePermission({ data, id });
  }
}
