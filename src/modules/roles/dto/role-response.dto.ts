import { Field, Int, ObjectType } from '@nestjs/graphql';

import { RoleResponse } from 'src/modules/users/dto/user-response.dto';

@ObjectType()
export class RoleResponseDto {
  @Field(() => Int)
  statusCode!: number;

  @Field()
  message!: string;

  @Field(() => RoleResponse, { nullable: true })
  body?: RoleResponse;
}

@ObjectType()
export class RolesListResponseDto {
  @Field(() => Int)
  statusCode!: number;

  @Field()
  message!: string;

  @Field(() => [RoleResponse])
  body!: RoleResponse[];
}
