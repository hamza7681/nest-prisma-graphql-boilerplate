import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './models/users.model';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/user-response.dto';
import {
  RegisterUserDto,
  RegisterUserResponseDto,
} from './dto/register-user.dto';
import { ResponseMetadata } from 'src/decorators/response-metadata.decorator';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => RegisterUserResponseDto)
  @ResponseMetadata(200, 'User registered successfully')
  async registerUser(
    @Args('data') data: RegisterUserDto,
  ): Promise<RegisterUserResponseDto> {
    return await this.usersService.registerUser({ data });
  }

  @Query(() => [UserResponseDto])
  @ResponseMetadata(200, 'Users fetched successfully')
  async getAllUsers(): Promise<UserResponseDto[]> {
    return this.usersService.getAllUsers();
  }
}
