import { Field, Int, ObjectType } from '@nestjs/graphql';

import { PermissionResponse } from 'src/modules/users/dto/user-response.dto';

@ObjectType()
export class PermissionResponseDto {
  @Field(() => Int)
  statusCode!: number;

  @Field()
  message!: string;

  @Field(() => PermissionResponse, { nullable: true })
  body?: PermissionResponse;
}

@ObjectType()
export class PermissionsListResponseDto {
  @Field(() => Int)
  statusCode!: number;

  @Field()
  message!: string;

  @Field(() => [PermissionResponse])
  body!: PermissionResponse[];
}
