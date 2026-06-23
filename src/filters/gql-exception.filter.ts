import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Catch()
export class GqlException implements GqlExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    GqlArgumentsHost.create(host);

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let type = 'INTERNAL_SERVER_ERROR';
    let error: unknown = exception;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const response = exception.getResponse();
      message =
        typeof response === 'string'
          ? response
          : (response as { message: string }).message;
      type = this.resolveType(statusCode);
      error = null; // ← was "error: null" (label syntax, not assignment)
    } else if (exception instanceof Error) {
      message = exception.message;
      error = exception.message;
    }

    throw new GraphQLError(message, {
      extensions: {
        statusCode,
        message,
        type,
        error,
      },
    });
  }

  private resolveType(statusCode: number): string {
    const map: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'UNPROCESSABLE_ENTITY',
      500: 'INTERNAL_SERVER_ERROR',
    };
    return map[statusCode] ?? 'INTERNAL_SERVER_ERROR';
  }
}
