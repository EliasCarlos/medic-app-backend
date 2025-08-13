import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvService {
  constructor(private configService: ConfigService) {}

  get databaseUrl(): string {
    return this.configService.get<string>('DATABASE_URL', { infer: true })!;
  }

  get port(): number {
    return this.configService.get<number>('PORT', { infer: true })!;
  }

  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET', { infer: true })!;
  }
}
