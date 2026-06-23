import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'src/generated/prisma/client';
import { asyncTryCatch } from 'src/utils/tryCatch';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL as string,
    });
    super({ adapter });
  }

  async onModuleInit() {
    const { error } = await asyncTryCatch({
      fn: async () => await this.$connect(),
    });

    if (error) console.error('Failed to connect to the database:', error);
    else console.log('Successfully connected to the database');
  }

  async onModuleDestroy() {
    const { error } = await asyncTryCatch({
      fn: async () => await this.$disconnect(),
    });

    if (error) console.error('Failed to disconnect from the database:', error);
    else console.log('Successfully disconnected from the database');
  }
}
