import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

@InputType()
export class RegisterUserDto {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

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

@ObjectType()
export class RegisterUserResponseDto {
  @Field(() => Int)
  statusCode!: number;

  @Field()
  message!: string;
}
