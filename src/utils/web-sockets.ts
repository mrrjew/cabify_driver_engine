import { Server as SocketIOServer, Socket } from 'socket.io';
import http from 'http';
import Driver from '../models/user/driver';
import Ride from '../models/ride';
import axios from 'axios';
import config from '../config';

export default async function initWebsocket(server) {
  const io = new SocketIOServer(server);
  let rides = [];
  let riders = [];

  // Fetch rides from the ride engine
  async function fetchRides() {
    try {
      const response = await axios.get(`${config.app.riderEngineUrl}/ride/rides`);
      rides = response.data.data;
    } catch (error) {
      console.error('Error fetching rides:', error);
    }
  }

  // Fetch riders from the rider engine
  async function fetchRiders() {
    try {
      const response = await axios.get(`${config.app.riderEngineUrl}/auth/rider/riders`);
      riders = response.data.data;
    } catch (error) {
      console.error('Error fetching riders:', error);
    }
  }

  // Initialize data
  await Promise.all([fetchRides(), fetchRiders()]);

  io.on('connection', async (socket: Socket) => {
    console.log('Client connected:', socket.id);

    // Event handler for updating driver location
    socket.on('updateLocation', async(driverInfo) => {
      const { _id, latitude, longitude } = driverInfo;
      const driver = await Driver.findOneAndUpdate({ _id }, { $set: { latitude, longitude } });
      await driver.save();
      io.emit('updateLocation',driver);
    });

    // Event handler to show pending ride for driver
    socket.on('showPendingRide', (driverInfo) => {
      const pendingRide = rides.find((ride) => ride.driver === driverInfo._id && ride.status === 'PENDING');
      io.emit('showPendingRide', pendingRide);
    });

    // Event handler for accepting a ride
    socket.on('accept', async (driverInfo) => {
      try {
        const driver = await Driver.findOne({ _id: driverInfo._id });
        const ride = rides.find((ride) => ride.driver === driver._id && ride.status === 'PENDING');
        if (!ride) {
          throw new Error('No pending ride found for the driver');
        }

        const rider = riders.find((rider) => rider._id === ride.rider);
        const { latitude: riderLat, longitude: riderLng } = rider;
        const { latitude: driverLat, longitude: driverLng } = driver;

        const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${riderLat},${riderLng}&destinations=${driverLat},${driverLng}&key=${config.maps.api_key}`;
        const response = await axios.get(apiUrl);
        const distance = response.data.rows[0].elements[0].distance;
        const duration = response.data.rows[0].elements[0].duration;

        io.emit('accept', {
          driver,
          distance,
          duration,
        });
      } catch (error) {
        console.error('Error accepting ride:', error);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}
