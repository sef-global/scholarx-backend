import { type Response } from 'express'
import { AppError } from './AppError'

class ErrorHandler {
  public async handleError(error: Error, response: Response): Promise<void> {
    console.error(error)
    await this.sendErrorResponse(error, response)
  }

  private async sendErrorResponse(
    error: Error,
    response: Response
  ): Promise<void> {
    if (error instanceof AppError) {
      response.status(error.httpCode).json({
        status: false,
        message: error.message,
        data: null
      })
    } else {
      response.status(500).json({
        status: false,
        message: 'Something went wrong. Please contact administrator.',
        data: null
      })
    }
  }
}

export const errorHandler = new ErrorHandler()
