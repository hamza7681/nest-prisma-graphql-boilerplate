import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const GetUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string => {
    const ctx = GqlExecutionContext.create(context);
    const { userId } = ctx.getContext<{ req: { user: { userId: string } } }>()
      .req.user;

    return userId;
  },
);
