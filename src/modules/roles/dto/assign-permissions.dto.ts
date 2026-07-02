import { Field, InputType } from '@nestjs/graphql';

import { IsArray, IsString } from 'class-validator';

@InputType()
export class AssignPermissionsDto {
  @Field()
  @IsString()
  roleId!: string;

  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  permissionIds!: string[];
}
