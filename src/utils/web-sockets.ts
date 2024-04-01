import { Server as SocketIOServer, Socket } from "socket.io";
import {app} from '../start/index'
import http from 'http'

const server = http.createServer(app)

const io = new SocketIOServer(server)

const driverLocations: Map<string, [number, number]> = new Map();
const passengerLocations: Map<string, [number, number]> = new Map();

io.on('connection', (socket:Socket) => {
    console.log('Client connected:', socket.id);

    // Handle driver location updates
    socket.on('driverLocationUpdate', (location: [number, number]) => {
        // Store driver location
        driverLocations.set(socket.id, location);
    });

    // Handle passenger location updates
    socket.on('passengerLocationUpdate', (location: [number, number]) => {
        // Store passenger location
        passengerLocations.set(socket.id, location);
    });

        // Handle ride request
        socket.on('requestRide', () => {
            // Calculate distance between passenger and drivers
            const passengerLocation = passengerLocations.get(socket.id);
            const availableDrivers = [...driverLocations.entries()];
            const distances = availableDrivers.map(([driverId, driverLocation]) => ({
                driverId,
                distance: calculateDistance(passengerLocation, driverLocation)
            }));
    
            // Send distances to passenger
            socket.emit('driverDistances', distances);
        });

           // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        driverLocations.delete(socket.id);
        passengerLocations.delete(socket.id);
    });

    function calculateDistance(location1: [number, number], location2: [number, number]): number {
        const [lat1, lon1] = location1;
        const [lat2, lon2] = location2;
    
        const R = 6371; // Radius of the Earth in kilometers
    
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
    
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
        const distance = R * c; // Distance in kilometers
        return distance;
    }
    
    function deg2rad(deg: number): number {
        return deg * (Math.PI / 180);
    }
    
})