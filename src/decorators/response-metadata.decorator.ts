import { SetMetadata } from '@nestjs/common';

export interface ResponseMetadataOptions {
  statusCode: number;
  message: string;
}

// Decorator to set response metadata for a route handler
export const ResponseMetadata = (statusCode: number, message: string) =>
  SetMetadata('responseMetadata', { statusCode, message });
