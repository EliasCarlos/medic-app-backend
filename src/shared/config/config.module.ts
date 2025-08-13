import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { EnvService } from './config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().uri().required(),
        PORT: Joi.number().default(3000),
        JWT_SECRET: Joi.string().min(10).required(),
      }),
    }),
  ],
  providers: [EnvService],
  exports: [EnvService],
})
export class AppConfigModule {}
