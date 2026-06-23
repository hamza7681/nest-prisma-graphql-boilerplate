import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GqlException } from './filters/gql-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe()); // Enable validation for all incoming requests

  app.useGlobalFilters(new GqlException()); // Use the custom GraphQL exception filter

  await app.listen(process.env.PORT!);

  const url = await app.getUrl();
  console.log(`🚀 Server running on: ${url}`);
}
bootstrap();
