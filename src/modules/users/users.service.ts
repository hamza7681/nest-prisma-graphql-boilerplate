import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from 'src/generated/prisma/client';
import {
  RegisterUserDto,
  RegisterUserResponseDto,
} from './dto/register-user.dto';
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
  }): Promise<RegisterUserResponseDto> {
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

  async getAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.prisma.user.findMany();

    return users.map((user) => this.formatUser({ user }));
  }

  formatUser({ user }: { user: User }): UserResponseDto {
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
