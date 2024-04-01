import { NextFunction } from 'express';
import { verifyJwt } from '../utils/token';
import { Request,Response } from 'express';

export default async function setContext (req:Request & {user:{_id:string}},res:Response,next:NextFunction){
  try {
    let header = req.headers.authorization ? req.headers.authorization.split(' ')[1] : '';
   
    let token = header ? header : null

    if (token) {
      const decoded: any = await verifyJwt(token);
      
      const id = decoded._id;
      console.log(id,decoded)
      
      const user = { _id: id };
      user ? req.user = user : null;
      next()
    }
  } catch (err) {
    console.log(err);
  }
};
