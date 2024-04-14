import IService, { IAppContext } from "../types/app";
import config from "../config";
import axios from "axios";

export default class RideService extends IService {
  constructor(props: IAppContext) {
    super(props);
  }

  // Initialize data
  async acceptRide(req: any, res: any) {
    try {
      const user = await this.authenticate_driver(req.user._id);

      if (!user) {
        return res.status(401).send('user not authenticated');
      }

      let rides:any
      try {
        // fetch rides from rider engine
        const response = await axios.get(`${config.app.riderEngineUrl}/ride/rides`);
        rides = response.data.data;
      } catch (error) {
        console.error('Error fetching rides:', error);
      }

      // find specific ride assigned to driver
      const ride = rides.find((ride: any) => ride.driver === user._id && ride.status === 'PENDING');
      if (!ride) {
        return res.status(404).send('ride not round');
      }

      await ride.updateOne({ $set: { status: 'ACCEPTED' } });
    } catch (e) {
      return res.status(500).send('error creating ride');
    }
  }

  async startRide() {}
}