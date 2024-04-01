import { HTTPS_STATUS_CODES } from '../constants';

export class RouteError extends Error {

  public status: HTTPS_STATUS_CODES;

  public constructor(status: HTTPS_STATUS_CODES, message: string) {
    super(message);
    this.status = status;
  }
}
