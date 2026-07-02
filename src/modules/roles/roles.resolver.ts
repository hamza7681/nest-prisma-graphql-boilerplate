import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { PERMISSIONS, ROLES } from 'src/constants/user';
import { RequirePermission } from 'src/decorators/require-permission.decorator';
import { ResponseMetadata } from 'src/decorators/response-metadata.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';

import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleResponseDto, RolesListResponseDto } from './dto/role-response.dto';
import { RolesService } from './roles.service';

@Resolver()
@UseGuards(AuthGuard, RolesGuard)
export class RolesResolver {
  constructor(private readonly rolesService: RolesService) {}

  @Mutation(() => RoleResponseDto)
  @ResponseMetadata(201, 'Role created successfully')
  @RequirePermission([PERMISSIONS.admin.write])
  async createRole(@Args('data') data: CreateRoleDto) {
    return await this.rolesService.createRole({ data });
  }

  @Query(() => RolesListResponseDto)
  @ResponseMetadata(200, 'Roles fetched successfully')
  @RequirePermission([PERMISSIONS.admin.read])
  async getAllRoles() {
    return await this.rolesService.getAllRoles();
  }

  @Query(() => RoleResponseDto)
  @ResponseMetadata(200, 'Role fetched successfully')
  @RequirePermission([PERMISSIONS.admin.read])
  async getRoleById(@Args('id') id: string) {
    return await this.rolesService.getRoleById({ id });
  }

  @Query(() => RoleResponseDto)
  @ResponseMetadata(200, 'Role fetched successfully')
  @RequirePermission([PERMISSIONS.admin.read])
  async getRoleByName(
    @Args('name', { type: () => String })
    name: (typeof ROLES)[keyof typeof ROLES],
  ) {
    return await this.rolesService.getRoleByName({ name });
  }

  @Mutation(() => RoleResponseDto)
  @ResponseMetadata(200, 'Role permissions updated successfully')
  @RequirePermission([PERMISSIONS.admin.write])
  async setRolePermissions(@Args('data') data: AssignPermissionsDto) {
    return await this.rolesService.setPermissions({ data });
  }

  @Mutation(() => RoleResponseDto)
  @ResponseMetadata(200, 'Role updated successfully')
  @RequirePermission([PERMISSIONS.admin.write])
  async updateRoleName(
    @Args('id') id: string,
    @Args('data') data: CreateRoleDto,
  ) {
    return await this.rolesService.updateRoleName({ id, data });
  }

  @Mutation(() => RoleResponseDto)
  @ResponseMetadata(200, 'Role deleted successfully')
  @RequirePermission([PERMISSIONS.admin.write])
  async deleteRole(@Args('id') id: string) {
    return await this.rolesService.deleteRole({ id });
  }
}
