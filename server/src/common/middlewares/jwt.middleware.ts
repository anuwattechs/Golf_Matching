import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { NestMiddleware } from '@nestjs/common';
import { config } from '../configs/config';

export class JwtMiddleware implements NestMiddleware {
  use(req: Request & { decoded: any }, res: Response, next: NextFunction) {
    try {
      // Get the JWT token from the request headers
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({
          status: 'error',
          message: 'No token provided',
          data: [],
        });
      }

      // Verify and decode the JWT token
      const decoded = jwt.verify(token, config.JWT_SECRET, {
        algorithms: ['HS256'],
      });

      // Attach the decoded token to the request object
      req.decoded = decoded;

      // Call the next middleware or route handler
      next();
    } catch (error) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token',
        data: [],
      });
    }
  }
}
