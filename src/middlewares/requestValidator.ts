import { ZodError, ZodSchema } from 'zod'

export const requestBodyValidator = (schema: ZodSchema<any, any, any>) => {
  return (req: any, res: any, next: any) => {
    try {
      schema.parse(req.body)
      next()
    } catch (err) {
      console.log(err)
      if (err instanceof ZodError) {
        const errorMessages = err.errors.map((issue) => ({
          message: `${issue.path.join('.')} is ${issue.message}`
        }))
        return res
          .status(400)
          .json({ error: 'Invalid data', details: errorMessages })
      }
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
}

export const requestQueryValidator = (schema: ZodSchema<any, any, any>) => {
  return (req: any, res: any, next: any) => {
    try {
      schema.parse(req.query)
      next()
    } catch (err) {
      if (err instanceof ZodError) {
        const errorMessages = err.errors.map((issue) => ({
          message: `${issue.path.join('.')} is ${issue.message}`
        }))
        return res
          .status(400)
          .json({ error: 'Invalid data', details: errorMessages })
      }
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
}
