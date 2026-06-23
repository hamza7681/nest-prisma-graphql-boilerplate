import { Query, Resolver } from '@nestjs/graphql';
import { User } from './models/users.model';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/user-response.dto';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [UserResponseDto])
  async getAllUsers(): Promise<UserResponseDto[]> {
    return this.usersService.getAllUsers();
  }
}
