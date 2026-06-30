import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Response } from 'express';

import { CurrentUser, FormatUserInput } from 'src/types/user';

import { PrismaService } from '../prisma/prisma.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import {
  UserResponse,
  UserResponseDto,
  UsersListResponseDto,
} from './dto/user-response.dto';
import { CommonService } from '../common/common.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private commonService: CommonService,
    private emailService: EmailService,
  ) {}

  async createAdmin({
    data,
  }: {
    data: RegisterAdminDto;
  }): Promise<UserResponseDto> {
    const { name, email, password, secretKey } = data;

    const isValidAdminSecretKey = secretKey === process.env.ADMIN_CREATION_KEY;

    if (!isValidAdminSecretKey)
      throw new UnauthorizedException('Invalid secret key');

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) throw new ConflictException('Email already in use');

    const hashedPassword = await this.commonService.hashString({
      value: password,
    });

    await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          isVerified: true, // Admins are verified by default
        },
      });

      const organization = await tx.organization.create({
        data: {
          name: `${name}'s Organization`,
        },
      });

      const role = await tx.role.upsert({
        where: { name: 'ADMIN' },
        update: {},
        create: {
          name: 'ADMIN',
        },
      });

      await tx.membership.create({
        data: {
          userId: user.id,
          organizationId: organization.id,
          roleId: role.id,
        },
      });

      const permission = await tx.permission.upsert({
        where: { key: '*' },
        update: {},
        create: {
          key: '*',
        },
      });

      await tx.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: permission.id,
        },
      });
    });

    return { message: 'Admin created successfully', statusCode: 201 };
  }

  async registerUser({
    data,
  }: {
    data: RegisterUserDto;
  }): Promise<UserResponseDto> {
    const { name, email, password } = data;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) throw new ConflictException('Email already in use');

    const hashedPassword = await this.commonService.hashString({
      value: password,
    });

    await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      const organization = await tx.organization.create({
        data: {
          name: `${name}'s Organization`,
        },
      });

      const role = await tx.role.upsert({
        where: { name: 'USER' },
        update: {},
        create: {
          name: 'USER',
        },
      });

      await tx.membership.create({
        data: {
          userId: user.id,
          organizationId: organization.id,
          roleId: role.id,
        },
      });
    });

    const token = await this.commonService.generateToken({
      payload: { email },
      expiresIn: '15m', // 15 minutes
    });

    await this.emailService.sendWelcomeEmail({ to: email, name, token });

    return { message: 'User registered successfully', statusCode: 201 };
  }

  async verifyUser({ token }: { token: string }): Promise<UserResponseDto> {
    const payload = await this.commonService.verifyToken({ token });

    if (!payload || !payload.email)
      throw new BadRequestException('Invalid or expired token');

    const existingUser = await this.prisma.user.findUnique({
      where: { email: payload.email as string },
    });

    if (!existingUser) throw new BadRequestException('User not found');

    if (existingUser.isVerified)
      throw new BadRequestException('User is already verified');

    await this.prisma.user.update({
      where: { email: payload.email as string },
      data: { isVerified: true },
    });

    return { message: 'User verified successfully', statusCode: 200 };
  }

  async loginUser({
    data,
    ctx,
  }: {
    data: LoginUserDto;
    ctx: { res: Response };
  }): Promise<UserResponseDto> {
    const { email, password } = data;

    const { res } = ctx;

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        memberships: {
          take: 1,
          select: {
            organization: true,
          },
        },
      },
    });

    if (!user) throw new BadRequestException('Wrong Credentials');

    if (!user.isVerified)
      throw new BadRequestException(
        'User is not verified. Please verify your email before logging in.',
      );

    const organizationId = user.memberships[0].organization.id;

    const isPasswordValid = await this.commonService.compareHashedString({
      value: password,
      hashedValue: user.password,
    });

    if (!isPasswordValid) throw new BadRequestException('Wrong Credentials');

    const token = await this.commonService.generateToken({
      payload: { userId: user.id, organizationId, email: user.email },
      expiresIn: '7d', // 7 days
    });

    this.commonService.setCookies({ token, res });

    return {
      statusCode: 200,
      message: 'User logged in successfully',
    };
  }

  async getAllUsers({
    user,
  }: {
    user: CurrentUser;
  }): Promise<UsersListResponseDto> {
    const users = await this.prisma.membership.findMany({
      where: {
        userId: {
          not: user.userId,
        },
      },
      select: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            isVerified: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        organization: {
          select: { id: true, name: true },
        },
        role: {
          select: {
            id: true,
            name: true,
            permissions: {
              select: {
                permission: {
                  select: { id: true, key: true, description: true },
                },
              },
            },
          },
        },
      },
    });

    return {
      statusCode: 200,
      message: 'Users fetched successfully',
      body: users.map((user) =>
        this.formatUser({
          user: user.user,
          organization: user.organization,
          role: user.role,
        }),
      ),
    };
  }

  async getLoggedInUser({
    user,
  }: {
    user: CurrentUser;
  }): Promise<UserResponseDto> {
    const existingUser = await this.prisma.membership.findUnique({
      where: {
        userId_organizationId: {
          userId: user.userId,
          organizationId: user.organizationId,
        },
      },
      select: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            isVerified: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        organization: {
          select: { id: true, name: true },
        },
        role: {
          select: {
            id: true,
            name: true,
            permissions: {
              select: {
                permission: {
                  select: { id: true, key: true, description: true },
                },
              },
            },
          },
        },
      },
    });

    if (!existingUser) throw new BadRequestException('User not found');

    const formattedUser = this.formatUser({
      user: existingUser.user,
      organization: existingUser.organization,
      role: existingUser.role,
    });

    return {
      statusCode: 200,
      message: 'Logged in user fetched successfully',
      body: formattedUser,
    };
  }

  logoutUser({ ctx }: { ctx: { res: Response } }): UserResponseDto {
    const { res } = ctx;

    this.commonService.clearCookies({ res });

    return {
      statusCode: 200,
      message: 'User logged out successfully',
    };
  }

  formatUser({ user, organization, role }: FormatUserInput): UserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      ...(organization && { organization }),
      ...(role && {
        role: role.name,
        permissions: role.permissions.map((p) => p.permission.key),
      }),
    };
  }
}
