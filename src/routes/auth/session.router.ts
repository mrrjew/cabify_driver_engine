import express, { Request, Response } from 'express';
import { appContext } from '../../start';

const router = express.Router()

router.post('/session/create',async (req:Request,res:Response) => {
    try{
        await appContext.services.UserSessionService.createUserSession(req,res)
    }catch(e){
        res.status(500).send('Error creating token')
    }

})

router.get('/session/getrefreshtoken', async (req:Request,res:Response) => {
    try{
        await appContext.services.UserSessionService.createUserSession(req,res)
    }catch(e){
        res.status(500).send('Error creating token')
    }
})

router.post('/session/refresh',async (req:Request,res:Response) => {
    try{
        const token = req.headers.authorization.split(' ')[1]
        await appContext.services.UserSessionService.refreshAccessToken(res,token)
    }catch(e){
        res.status(500).send('Error creating token')
    }

})


export default router