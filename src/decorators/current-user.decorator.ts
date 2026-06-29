import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { CurrentUser } from 'src/types/user';

export const GetUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): CurrentUser => {
    const ctx = GqlExecutionContext.create(context);
    const { userId, email, organizationId } = ctx.getContext<{
      req: { user: CurrentUser };
    }>().req.user;

    return { userId, email, organizationId };
  },
);
