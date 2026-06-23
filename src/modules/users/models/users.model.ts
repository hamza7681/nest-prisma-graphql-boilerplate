import { Field } from '@nestjs/graphql';

export class User {
  @Field()
  id!: string;

  @Field({ nullable: true })
  name!: string;

  @Field()
  email!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
