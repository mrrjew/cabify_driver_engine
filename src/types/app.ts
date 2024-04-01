import { IModels } from '../models';
import { IServices } from '../services';
export interface IAppContext {
  models?: IModels;
  services?: IServices;
}

export default class IService {
  models?: IModels;
  context?: IAppContext;
  constructor(context: IAppContext) {
    this.models = context.models;
    this.context = context;
  }

  async authenticate_driver(userId: any) {
    const driver = await this.context.models.Driver.findOne({ _id: userId });

    if (!driver) {
      throw new Error('User not authenticated');
    }

    return driver
  }

  async authenticate_rider(userId: any) {
    const driver = await this.context.models.Driver.findOne({ _id: userId });

    if (!driver) {
      throw new Error('User not authenticated');
    }

    return driver
  }

}
