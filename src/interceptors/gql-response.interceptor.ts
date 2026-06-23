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

@Injectable()
export class GqlResponseInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    GqlExecutionContext.create(context);

    const meta = this.reflector.get<ResponseMetadataOptions>(
      'responseMetadata',
      context.getHandler(),
    );

    return next.handle().pipe(
      map((data: unknown) => ({
        statusCode: meta?.statusCode || 200,
        message: meta?.message || 'Success',
        body: data,
      })),
    );
  }
}
