import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserResponse {
  @Field(() => ID)
  id!: string;

  @Field(() => String, { nullable: true })
  name!: string | null;

  @Field()
  email!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field()
  isVerified!: boolean;
}

@ObjectType()
export class UserResponseDto {
  @Field(() => Int)
  statusCode!: number;

  @Field()
  message!: string;

  @Field(() => UserResponse, { nullable: true })
  body?: UserResponse;
}

@ObjectType()
export class UsersListResponseDto {
  @Field(() => Int)
  statusCode!: number;

  @Field()
  message!: string;

  @Field(() => [UserResponse])
  body!: UserResponse[];
}
