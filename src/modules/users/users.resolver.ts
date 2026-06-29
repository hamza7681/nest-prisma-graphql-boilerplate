import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Response } from 'express';

import { GetUser } from 'src/decorators/current-user.decorator';
import { ResponseMetadata } from 'src/decorators/response-metadata.decorator';
import { AuthGuard } from 'src/guards/auth.guard';

import { LoginUserDto } from './dto/login-user.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { UserResponseDto, UsersListResponseDto } from './dto/user-response.dto';
import { User } from './models/users.model';
import { UsersService } from './users.service';

import type { CurrentUser } from 'src/types/user';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => UserResponseDto)
  @ResponseMetadata(201, 'Admin created successfully')
  async createAdmin(
    @Args('data') data: RegisterAdminDto,
  ): Promise<UserResponseDto> {
    return await this.usersService.createAdmin({ data });
  }

  @Mutation(() => UserResponseDto)
  @ResponseMetadata(200, 'User logged in successfully')
  async loginUser(
    @Args('data') data: LoginUserDto,
    @Context() ctx: { res: Response },
  ): Promise<UserResponseDto> {
    return await this.usersService.loginUser({ data, ctx });
  }

  @Query(() => UsersListResponseDto)
  @UseGuards(AuthGuard)
  @ResponseMetadata(200, 'Users fetched successfully')
  async getAllUsers(): Promise<UsersListResponseDto> {
    return await this.usersService.getAllUsers();
  }

  @Query(() => UserResponseDto)
  @UseGuards(AuthGuard)
  @ResponseMetadata(200, 'Logged in user fetched successfully')
  async getLoggedInUser(
    @GetUser() user: CurrentUser,
  ): Promise<UserResponseDto> {
    return await this.usersService.getLoggedInUser({ user });
  }

  @Mutation(() => UserResponseDto)
  @UseGuards(AuthGuard)
  @ResponseMetadata(200, 'User logged out successfully')
  logoutUser(@Context() ctx: { res: Response }): UserResponseDto {
    return this.usersService.logoutUser({ ctx });
  }
}
