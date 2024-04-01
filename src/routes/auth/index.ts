import express from 'express';
import user from './user.router'
import session from './session.router'
import googleOAuth from './googleOauth.router'

const router = express.Router()

router.use(user)
router.use(session)
router.use(googleOAuth)

export default router