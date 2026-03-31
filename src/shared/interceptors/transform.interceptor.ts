import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  message?: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        // If the data already contains a 'message' field, we use it.
        const message = data?.message || 'Operation completed successfully';
        
        // If 'message' was at the root of 'data', we can clean it up from data
        const cleanedData = data?.message ? { ...data } : data;
        if (cleanedData?.message) delete cleanedData.message;

        return {
          success: true,
          message,
          data: cleanedData,
        };
      }),
    );
  }
}
