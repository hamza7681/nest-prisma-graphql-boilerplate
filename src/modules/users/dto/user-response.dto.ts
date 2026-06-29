import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PermissionResponse {
  @Field(() => ID)
  id!: string;

  @Field()
  key!: string;

  @Field(() => String, { nullable: true })
  description!: string | null;
}

@ObjectType()
export class RoleResponse {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field(() => [PermissionResponse])
  permissions!: PermissionResponse[];
}

@ObjectType()
export class OrganizationResponse {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;
}

@ObjectType()
export class UserResponse {
  @Field(() => ID)
  id!: string;

  @Field(() => String, { nullable: true })
  name!: string | null;

  @Field()
  email!: string;

  @Field()
  isVerified!: boolean;

  @Field(() => OrganizationResponse, { nullable: true })
  organization?: OrganizationResponse;

  @Field(() => String, { nullable: true })
  role?: string;

  @Field(() => [String], { nullable: true })
  permissions?: string[];
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
