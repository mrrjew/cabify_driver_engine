import express, { Request, Response } from 'express';
import { appContext } from '../../../start';

const router = express.Router();

router.post('/create', async (req: Request, res: Response) => {
  try {
    await appContext.services.DriverSessionService.createUserSession(req, res);
  } catch (e) {
    res.status(500).send('Error creating token');
  }
});

router.get('/getrefreshtoken', async (req: Request, res: Response) => {
  try {
    await appContext.services.DriverSessionService.createUserSession(req, res);
  } catch (e) {
    res.status(500).send('Error creating token');
  }
});

router.post('/refresh', async (req: Request, res: Response) => {
  try {
    await appContext.services.DriverSessionService.refreshAccessToken(req, res);
  } catch (e) {
    res.status(500).send('Error creating token');
  }
});

export default router;
