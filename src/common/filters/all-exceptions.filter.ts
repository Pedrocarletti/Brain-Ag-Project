import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, LoggerService } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService = console) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const { statusCode, message, error } = this.toHttpError(exception);

    if (statusCode >= 500) {
      this.logger.error({ path: request.url, method: request.method, exception }, 'Unhandled HTTP exception');
    }

    response.status(statusCode).json({
      statusCode,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private toHttpError(exception: unknown): { statusCode: number; message: string | string[]; error: string } {
    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const response = exception.getResponse();
      if (typeof response === 'object' && response !== null) {
        const payload = response as { message?: string | string[]; error?: string };
        return {
          statusCode,
          message: payload.message ?? exception.message,
          error: payload.error ?? HttpStatus[statusCode],
        };
      }
      return { statusCode, message: exception.message, error: HttpStatus[statusCode] };
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        return {
          statusCode: 409,
          message: this.uniqueMessage(exception.meta?.target, exception.meta?.modelName),
          error: 'Conflict',
        };
      }
      if (exception.code === 'P2025') {
        return { statusCode: 404, message: 'Registro não encontrado.', error: 'Not Found' };
      }
    }

    return { statusCode: 500, message: 'Erro interno inesperado.', error: 'Internal Server Error' };
  }

  private uniqueMessage(target: unknown, modelName?: unknown): string {
    const fields = Array.isArray(target) ? target.join(',') : String(target ?? '');
    const model = String(modelName ?? '');
    if (model === 'Producer' || fields.includes('document')) return 'CPF/CNPJ já cadastrado.';
    if (model === 'Crop') return 'Cultura já cadastrada.';
    if (model === 'Harvest') return 'Safra já cadastrada.';
    if (fields.includes('crops_name')) return 'Cultura já cadastrada.';
    if (fields.includes('harvests_name') || fields.includes('harvests_year') || fields.includes('year')) {
      return 'Safra já cadastrada.';
    }
    if (fields.includes('farmId') && fields.includes('cropId') && fields.includes('harvestId')) {
      return 'Essa cultura já foi cadastrada para essa fazenda nessa safra.';
    }
    return 'Registro duplicado.';
  }
}
