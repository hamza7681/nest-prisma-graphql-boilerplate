import { Field, InputType } from '@nestjs/graphql';

import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

@InputType()
export class RegisterAdminDto {
  @Field()
  @IsString()
  @IsOptional()
  name!: string;

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

  @Field()
  @IsString()
  secretKey!: string;
}
