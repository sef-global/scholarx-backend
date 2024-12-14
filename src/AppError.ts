export class AppError extends Error {
  public readonly name: string
  public readonly httpCode: number
  public readonly isOperational: boolean
  public readonly details?: Record<string, any>

  constructor(
    name: string = AppErrorTypes.INTERNAL_SERVER_ERROR,
    message: string = AppErrorDetails[AppErrorTypes.INTERNAL_SERVER_ERROR]
      .message,
    httpCode: number = AppErrorDetails[AppErrorTypes.INTERNAL_SERVER_ERROR]
      .httpCode,
    isOperational = true,
    details?: Record<string, any>
  ) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = name
    this.httpCode = httpCode
    this.isOperational = isOperational
    this.details = details
    Error.captureStackTrace(this)
  }
}

export function createAppError(
  errorType: AppErrorTypes,
  details?: Record<string, any>
): AppError {
  const { message, httpCode } = AppErrorDetails[errorType]
  return new AppError(errorType, message, httpCode, true, details)
}

export enum AppErrorTypes {
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  MULTIPLE_RECORDS_FOUND_ERROR = 'MULTIPLE_RECORDS_FOUND_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  PERMISSION_DENIED_ERROR = 'PERMISSION_DENIED_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR'
}

const AppErrorDetails: Record<
  AppErrorTypes,
  { message: string; httpCode: number }
> = {
  [AppErrorTypes.VALIDATION_ERROR]: {
    message: 'Invalid input data',
    httpCode: 400
  },
  [AppErrorTypes.AUTHENTICATION_ERROR]: {
    message: 'Authentication failed',
    httpCode: 401
  },
  [AppErrorTypes.NOT_FOUND_ERROR]: {
    message: 'Resource not found',
    httpCode: 404
  },
  [AppErrorTypes.INTERNAL_SERVER_ERROR]: {
    message: 'An internal server error occurred',
    httpCode: 500
  },
  [AppErrorTypes.PERMISSION_DENIED_ERROR]: {
    message: 'Insufficient permission for this action',
    httpCode: 403
  },
  [AppErrorTypes.MULTIPLE_RECORDS_FOUND_ERROR]: {
    message: 'Multple records has been found',
    httpCode: 400
  }
}
