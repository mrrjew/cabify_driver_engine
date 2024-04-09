import express from 'express';
import auth from './auth'
import upload from "./upload.router"

const router = express.Router()

router.use('/auth',auth)
router.use('/files',upload)

export default router