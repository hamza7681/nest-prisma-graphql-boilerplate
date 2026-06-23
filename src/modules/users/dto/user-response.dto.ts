import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserResponseDto {
  @Field(() => ID)
  id!: string;

  @Field(() => String, { nullable: true })
  name!: string | null;

  @Field()
  email!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
