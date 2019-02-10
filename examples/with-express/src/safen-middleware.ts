import {
  ErrorRequestHandler,
  Handler,
  NextFunction,
  Request,
  Response
  } from "express"
import { create, InvalidValueError } from "safen"

export function errorHandler(): ErrorRequestHandler {
  return (error, req, res, next) => {
    if (error instanceof InvalidValueError) {
      return res.json({
        success: false,
        errors: error.errors,
      })
    }
    return next(error)
  }
}

export function body(ctx: string): Handler {
  const validator = create(ctx)
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      validator.assert(req.body)
    } catch (e) {
      return next(e)
    }
    next()
  }
}

export function query(ctx: string): Handler {
  const validator = create(ctx)
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      validator.assert(req.query)
    } catch (e) {
      return next(e)
    }
    next()
  }
}
