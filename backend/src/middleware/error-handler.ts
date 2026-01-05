import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
}

export function errorHandler(
  err: ApiError,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error('Error:', err);

  // Prisma errors
  if (err.code === 'P2025') {
    res.status(404).json({
      error: 'Record not found',
      message: err.message,
    });
    return;
  }

  if (err.code === 'P2002') {
    res.status(409).json({
      error: 'Duplicate entry',
      message: err.message,
    });
    return;
  }

  // Default error
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: statusCode === 500 ? 'Internal server error' : err.message,
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.path} not found`,
  });
}
