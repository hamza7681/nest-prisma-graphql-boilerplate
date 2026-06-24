import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';

import { Response } from 'express';

import { User } from 'src/generated/prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { LoginUserDto } from './dto/login-user.dto';
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

  async registerUser({
    data,
  }: {
    data: RegisterUserDto;
  }): Promise<UserResponseDto> {
    const { email, name, password } = data;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser)
      throw new ConflictException('User with this email already exists');

    const hashedPassword = await this.commonService.hashString({
      value: password,
    });

    const newUser = await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    if (!newUser) throw new BadRequestException('Failed to create user');

    const token = await this.commonService.generateToken({
      payload: { userId: newUser.id },
      expiresIn: 900, // 15 minutes
    });

    await this.emailService.sendWelcomeEmail({
      to: email,
      name: name as string,
      token,
    });

    return {
      statusCode: 200,
      message: 'User registered successfully',
    };
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
    });

    if (!user) throw new BadRequestException('Wrong Credentials');

    const isPasswordValid = await this.commonService.compareHashedString({
      value: password,
      hashedValue: user.password,
    });

    if (!isPasswordValid) throw new BadRequestException('Wrong Credentials');

    const token = await this.commonService.generateToken({
      payload: { userId: user.id },
      expiresIn: '7d', // 7 days
    });

    this.commonService.setCookies({ token, res });

    return {
      statusCode: 200,
      message: 'User logged in successfully',
    };
  }

  async getAllUsers(): Promise<UsersListResponseDto> {
    const users = await this.prisma.user.findMany();

    return {
      statusCode: 200,
      message: 'Users fetched successfully',
      body: users.map((user) => this.formatUser({ user })),
    };
  }

  async getLoggedInUser({
    userId,
  }: {
    userId: string;
  }): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new BadRequestException('User not found');

    const formattedUser = this.formatUser({ user });

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

  formatUser({ user }: { user: User }): UserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
