import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthGuard extends PassportAuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);

    return ctx.getContext<{ req: Request }>().req;
  }

  handleRequest<TUser = { userId: string }>(
    err: Error | null,
    user: TUser | false,
  ): TUser {
    if (err || !user) throw new UnauthorizedException('Unauthorized');

    return user;
  }
}
