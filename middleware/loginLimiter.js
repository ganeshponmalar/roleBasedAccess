// middleware/loginLimiter.js
import rateLimit from 'express-rate-limit'
import { logEvents } from './logger.js'

export const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { message: 'Too many login attempts… please try again after 60s' },
  handler: (req, res, next, options) => {
    logEvents(
      `Too Many Requests: ${options.message.message}\t${req.method}\t${req.url}`,
      'errLog.log'
    )
    res.status(options.statusCode).json(options.message)
  },
  standardHeaders: true,
  legacyHeaders: false
})

