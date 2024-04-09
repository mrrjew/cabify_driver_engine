import express from 'express';
import driver from './driver.router';
import session from './session/driver.session.router';
import googleOAuth from './driver.googleOauth.router';

const router = express.Router()

router.use('/driver', driver);
router.use('/session', session);
router.use(googleOAuth)

export default router