import express, { Request, Response } from 'express';
import { IAppContext } from '../../types/app';
import setContext from '../../middlewares/context';
import { appContext } from '../../start';
import Driver from '../../models/user/driver';

const router = express.Router();

router.get('/me', setContext, async (req: Request & { user: any }, res: Response) => {
  console.log(req.user._id);
  const _Driver = await appContext.models.Driver.findById(req.user._id);
  return res.status(200).json(_Driver);
});

router.get('/drivers', setContext, async (_: any, res: Response) => {
  const _Driver = await Driver.find();
  res.status(200).json(_Driver);
});

router.post('/register', async (req: Request, res: Response) => {
  await appContext.services.DriverService.registerDriver(req, res);
});

router.post('/verify', async (req: Request, res: Response) => {
  await appContext.services.DriverService.verifyDriver(req, res);

});

router.post('/forgot-password', async (req: Request, res: Response) => {
  await appContext.services.DriverService.forgotPassword(req, res);
});

router.post('/reset-password', async (req: Request, res: Response) => {
  await appContext.services.DriverService.resetPassword(req, res);
});

router.post('/login', async (req: Request, res: Response) => {
  await appContext.services.DriverService.loginDriver(req, res);
});

router.put('/update-driver', setContext, async (req: Request & { user: any }, res: Response) => {
  await appContext.services.DriverService.updateDriver(req, res);
});

router.delete('/delete-delete', setContext, async (req: Request & { Driver: any }, res: Response) => {
  await appContext.services.DriverService.deleteDriver(req, res);
});

export default router;
