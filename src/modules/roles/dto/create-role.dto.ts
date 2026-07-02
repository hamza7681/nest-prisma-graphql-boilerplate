import { Field, InputType } from '@nestjs/graphql';

import { IsIn, IsString } from 'class-validator';

import { ROLE_KEYS, ROLES } from 'src/constants/user';

@InputType()
export class CreateRoleDto {
  @Field(() => String)
  @IsString()
  @IsIn(ROLE_KEYS)
  name!: (typeof ROLES)[keyof typeof ROLES];
}
