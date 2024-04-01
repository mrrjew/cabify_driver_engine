import express, { Request, Response } from 'express';
import { IAppContext } from '../../types/app';
import setContext from '../../middlewares/context';
import { appContext} from '../../start';
import User from '../../models/user/rider';

const router = express.Router();

router.get('/me',setContext,async (req: Request & { user: any }, res: Response) => {
  const user = await User.findOne({_id:req.user._id})
  res.status(200).json(user)
})

router.get('/users',setContext,async (_:any, res: Response) => {
  const user = await User.find()
  res.status(200).json(user)
})

router.post('/register', async (req: Request, res: Response) => {
    const user = await appContext.services.UserService.registerUser(req,res);
    return res.status(201).json({ user });
});

router.post('/verify', async(req: Request, res: Response) => {
    const response = await appContext.services.UserService.verifyUser(req,res);
    res.status(200).json(response);
});

router.post('/forgotpassword', async(req: Request, res: Response) => {
    const response = await appContext.services.UserService.forgotPassword(req,res);
    res.status(200).json(response);
});

router.post('/resetpassword', async(req: Request, res: Response) => {
    const response = await appContext.services.UserService.resetPassword(req,res);
    res.status(200).json(response);
});

router.post('/login', async(req: Request, res: Response) => {
    const user = await appContext.services.UserService.loginUser(req,res);
    res.status(200).json(user);
});

router.put('/updateuser', setContext, async(req: Request & { user: any }, res: Response) => {
    const user = await appContext.services.UserService.updateUser(req,res);
    res.status(200).json(user);
});

router.delete('/deleteuser',setContext, async(req: Request & { user: any }, res: Response) => {
    await appContext.services.UserService.deleteUser(req,res);
});

router.get('/getuserrating',setContext, async(req: Request & { user: any }, res: Response) => {
    const rating = await appContext.services.UserService.getUserRating(req,res);
    res.status(201).json(rating);

});

export default router;
