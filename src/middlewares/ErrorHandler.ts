import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  // Log the error internally for developers
  console.error(err);

  // If headers are already sent, delegate to default express error handler
  if (res.headersSent) {
    return _next(err);
  }

  // Return a generic 500 error response without exposing the stack trace
  return res.status(500).json({
    message: 'Server Error'
  });
}
