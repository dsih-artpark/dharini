import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorHandlingService } from 'src/common/service/errorHandle.service';
import { redactForLog } from 'src/common/functions/redact-for-log';
import { QueryFailedError } from 'typeorm';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    response.status(status).json({
      statusCode: status,
      message: (exceptionResponse as any).message || 'Internal server error',
      error: (exceptionResponse as any).error || 'HttpException',
    });
  }
}

@Catch(QueryFailedError)
export class QueryExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(ErrorHandlingService)
    private readonly errorHandlingService: ErrorHandlingService,
  ) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected error occurred.';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || message;
    } else if (exception.code) {
      // Database-specific errors or other custom error codes
      // Handle specific PostgreSQL errors
      if (exception.code) {
        switch (exception.code) {
          case '23505': // Unique constraint violation
            status = HttpStatus.CONFLICT;
            message = exception.detail || 'Duplicate value found.';
            break;
          case '23503': // Foreign key violation
            status = HttpStatus.BAD_REQUEST;
            message = 'Invalid reference to another table.';
            break;
          case '23514': // Check constraint violation
            status = HttpStatus.BAD_REQUEST;
            message = 'A value violates a check constraint.';
            break;
          default:
            message = exception.message || 'A database error occurred.';
        }
      }
    } else {
      message = exception.message || message;
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}

@Catch(ForbiddenException)
export class ForbiddenFilter implements ExceptionFilter {
  catch(exception: ForbiddenException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const status = exception.getStatus();
    const response = ctx.getResponse<Response>();

    response.status(status).json({
      success: false,
      message: 'Unauthorized access',
    });
  }
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected error occurred.';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || message;
    } else if (exception.code) {
      // Database-specific errors or other custom error codes
      // Handle specific PostgreSQL errors
      if (exception.code) {
        switch (exception.code) {
          case '23505': // Unique constraint violation
            status = HttpStatus.CONFLICT;
            message = exception.detail || 'Duplicate value found.';
            break;
          case '23503': // Foreign key violation
            status = HttpStatus.BAD_REQUEST;
            message = 'Invalid reference to another table.';
            break;
          case '23514': // Check constraint violation
            status = HttpStatus.BAD_REQUEST;
            message = 'A value violates a check constraint.';
            break;
          default:
            message = exception.message || 'A database error occurred.';
        }
      }
    } else {
      message = exception.message || message;
    }

    this.logger.error(
      `Unhandled exception on ${request.method} ${request.url}: ${message}`,
      JSON.stringify(
        redactForLog({
          body: request.body,
          params: request.params,
          query: request.query,
        }),
      ),
    );

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
