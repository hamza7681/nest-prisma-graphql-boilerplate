import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

import { map, Observable } from 'rxjs';

import { ResponseMetadataOptions } from 'src/decorators/response-metadata.decorator';

interface StandardResponse {
  statusCode: number;
  message: string;
  body?: unknown;
}

function isStandardResponse(data: unknown): data is StandardResponse {
  return (
    data !== null &&
    typeof data === 'object' &&
    'statusCode' in data &&
    'message' in data &&
    'body' in data
  );
}

@Injectable()
export class GqlResponseInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const gqlContext = GqlExecutionContext.create(context);

    // Only apply to GraphQL requests
    if (!gqlContext.getInfo()) return next.handle();

    const meta = this.reflector.get<ResponseMetadataOptions>(
      'responseMetadata',
      context.getHandler(),
    );

    return next.handle().pipe(
      map((data: unknown) => {
        if (isStandardResponse(data)) return data;

        return {
          statusCode: meta?.statusCode ?? 200,
          message: meta?.message ?? 'Success',
          body: data ?? null,
        } satisfies StandardResponse;
      }),
    );
  }
}
