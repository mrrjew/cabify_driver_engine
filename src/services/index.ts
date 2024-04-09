import { IAppContext } from '../types/app';

//user
import DriverService from './auth/driver';
import DriverSessionService from '../services/auth/session/driver.session';

export interface IServices {
  DriverService: DriverService;
  DriverSessionService:DriverSessionService;
}

export default async function initServices(context: IAppContext): Promise<IServices> {
  return {
    DriverService: new DriverService(context),
    DriverSessionService: new DriverSessionService(context),
  };
}
