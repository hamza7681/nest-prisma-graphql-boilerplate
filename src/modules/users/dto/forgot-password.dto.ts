import { Field, InputType } from '@nestjs/graphql';

import { IsEmail, IsString } from 'class-validator';

@InputType()
export class ForgotPasswordDto {
  @Field()
  @IsString()
  @IsEmail()
  email!: string;
}
