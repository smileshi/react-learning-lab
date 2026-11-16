
export type ApiErrorType =
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'SERVER_ERROR'
  | 'NETWORK_ERROR'
  | 'CANCELLED'
  | 'UNKNOWN_ERROR';

export class ApiError extends Error {
  public type: ApiErrorType;
  public status?: number;
  public details?: unknown;

  constructor(
    type: ApiErrorType,
    status?: number,
    message?: string,
    details?: unknown
  ) {
    super(message ?? type);

    this.name = 'ApiError';
    this.type = type;
    this.status = status;
    this.details = details;
  }
}
