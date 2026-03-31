import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { EnvService } from '../config/config.service';
import { softDeleteExtension } from './prisma-soft-delete.extension';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private _extendedClient;

  constructor(private env: EnvService) {
    super({
      datasources: {
        db: { url: env.databaseUrl },
      },
    });
    this._extendedClient = this.$extends(softDeleteExtension);

    return new Proxy(this, {
      get: (target, prop) => target._extendedClient[prop] ?? target[prop],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
