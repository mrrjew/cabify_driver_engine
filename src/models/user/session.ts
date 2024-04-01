import { Schema, model } from "mongoose";

const sessionSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref:"User"},
    valid: {type: Boolean, required:true, default:true}
})

const Session = model('Session',sessionSchema)
export default Session