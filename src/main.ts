import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { GqlException } from './filters/gql-exception.filter';

async function bootstrap() {
  const isProduction = process.env.NODE_ENV === 'production';

  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: isProduction ? process.env.CORS_ORIGIN?.split(',') : '*',
      credentials: true,
    },
  });

  app.useGlobalPipes(new ValidationPipe()); // Enable validation for all incoming requests

  app.useGlobalFilters(new GqlException()); // Use the custom GraphQL exception filter

  app.use(cookieParser()); // Enable cookie parsing for incoming requests

  await app.listen(process.env.PORT!);

  const url = await app.getUrl();
  console.log(`🚀 Server running on: ${url}`);
}
void bootstrap();
