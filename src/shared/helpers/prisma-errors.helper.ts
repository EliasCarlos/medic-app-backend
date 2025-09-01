import { HttpStatus } from '@nestjs/common';

export interface PrismaErrorMap {
  [key: string]: {
    status: number;
    message: (meta?: Record<string, unknown>) => string;
  };
}

export const PRISMA_ERRORS: PrismaErrorMap = {
  P2002: {
    status: HttpStatus.CONFLICT,
    message: (meta) =>
      `Duplicate value in field: ${meta?.target || 'unique field'}`,
  },
  P2025: {
    status: HttpStatus.NOT_FOUND,
    message: () => 'Record not found',
  },
};
