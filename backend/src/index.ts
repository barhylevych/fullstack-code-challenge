/**
 * Setup express server.
 */
import path from 'path';
import helmet from 'helmet';
import 'express-async-errors';
import express, { Request, Response, NextFunction } from 'express';

import Controllers from './controllers';
import * as CONSTANTS from './constants';
import { RouteError } from './other/classes';
import * as process from 'process';

const app = express();

// Basic middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Add APIs, must be after middleware
app.use('/api', Controllers);

// Add error handler
app.use((
  err: Error,
  _: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  let status = CONSTANTS.HTTPS_STATUS_CODES.BAD_REQUEST;
  if (err instanceof RouteError) {
    status = err.status;
  }
  return res.status(status).json({ error: err.message });
});

// Set static directory (js and css).
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

if (CONSTANTS.ENVIRONMENT.NODE_ENV !== 'test') {
  app.listen(CONSTANTS.ENVIRONMENT.PORT, () => {
    console.log(`Server is running on http://localhost:${CONSTANTS.ENVIRONMENT.PORT}`);
  });
}

export default app;
