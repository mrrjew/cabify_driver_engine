import { connect } from 'mongoose';
import { Config } from '../config';
import log from '../utils/log';

// Rider
import Driver from './user/driver';
// ride
import Ride from './ride';


export interface IModels {
  Driver: typeof Driver;
  Ride: typeof Ride;
}

export default async function initDB(config: Config['db']): Promise<IModels> {
  try {
    await connect(config.uri, { autoIndex: true });
    log.info('Connected to database successfully');

    await Driver.createCollection();
    await Ride.createCollection();

    return {
      Driver,
      Ride
    };
  } catch (e) {
    throw new Error(`Error while connecting to database : ${e}`);
  }
}