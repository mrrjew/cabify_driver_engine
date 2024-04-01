import IService, { IAppContext } from "../types/app";

export default class RideService extends IService {
    constructor(props:IAppContext){
        super(props)
    }

    async requestRide(req:any,res:any){
        const user = await this.authenticate_user(req.user._id)

        if(!user){
            return res.status(404).send("user not authenticated")
        }
        
        const {fare,pickupLocation,destination} = req.body
        
        if(!fare || !pickupLocation || !destination){
            return res.status(500).send("missing required fields")
        }
        
        try{
            const ride = await this.models.Ride.create({...req.body})
            await ride.save()
            return res.status(201).json({message:"ride created", ride})
        }catch(e){
            return res.status(500).send("error creating ride")
        }
    }
}