import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
  HttpException,
} from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
} from '@prisma/client/runtime/library';
import { Request, Response } from 'express';
import { PRISMA_ERRORS } from '../helpers/prisma-errors.helper';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof ThrottlerException) {
      const retryAfter = response.getHeader?.('Retry-After');
      const resetTime = response.getHeader?.('X-RateLimit-Reset');

      let waitTime = retryAfter || 0;

      if (resetTime) {
        const resetTimestamp = Number(resetTime) * 1000;
        const now = Date.now();
        waitTime = Math.max(Math.ceil((resetTimestamp - now) / 1000), 0);
      }

      return response.status(429).json({
        statusCode: 429,
        message: `Too many login attempts. Please try again in ${waitTime} seconds.`,
        error: 'Too Many Requests',
        path: request.url,
      });
    }

    if (exception instanceof PrismaClientKnownRequestError) {
      const errorConfig = PRISMA_ERRORS[exception.code];

      if (errorConfig) {
        return response.status(errorConfig.status).json({
          statusCode: errorConfig.status,
          message: errorConfig.message(exception.meta as any),
          error: 'Database Error',
          path: request.url,
        });
      }

      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `Database error (code: ${exception.code})`,
        error: 'Database Error',
        path: request.url,
      });
    }

    if (exception instanceof PrismaClientUnknownRequestError) {
      this.logger.error('Unknown error in Prisma', exception.message);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal database error',
        error: 'Database Error',
        path: request.url,
      });
    }

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? (exception.getResponse() as any).message || exception.message
        : 'Internal server error';

    if (!(exception instanceof HttpException)) {
      this.logger.error(
        `Unexpected error on [${request.method}] ${request.url}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    return response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
