import { Field, InputType } from '@nestjs/graphql';

import { IsIn, IsOptional, IsString } from 'class-validator';

import { PERMISSION_KEYS } from 'src/constants/user';

@InputType()
export class CreatePermissionDto {
  @Field()
  @IsString()
  @IsIn(PERMISSION_KEYS)
  key!: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;
}
