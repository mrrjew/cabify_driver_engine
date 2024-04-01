import { IAppContext } from '../types/app';

//user
import RiderService from './rider';
import DriverService from './driver';
import UserSessionService from './session';

export interface IServices {
  RiderService: RiderService;
  DriverService: DriverService;
  UserSessionService:UserSessionService;
}

export default async function initServices(context: IAppContext): Promise<IServices> {
  return {
    RiderService: new RiderService(context),
    DriverService: new DriverService(context),
    UserSessionService: new UserSessionService(context),
  };
}
