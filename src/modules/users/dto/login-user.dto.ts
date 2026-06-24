import { Field, InputType } from '@nestjs/graphql';

import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

@InputType()
export class LoginUserDto {
  @Field()
  @IsString()
  @IsEmail()
  email!: string;

  @Field()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*$/, {
    message:
      'password must contain at least 1 uppercase letter and 1 special character',
  })
  password!: string;
}
