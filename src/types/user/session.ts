import { Types,Document } from "mongoose"

export interface IUserSession {
    userId: Types.ObjectId
    valid: boolean
  }

export default interface IUserSessionDocument extends IUserSession,Document {
    _id:Types.ObjectId;
    createdAt:Date;
    updatedAt:Date;
}