import express from 'express';
import auth from './auth'
import upload from "./upload.router"
import ride from "./ride"

const router = express.Router()

router.use('/auth',auth)
router.use('/files',upload)
router.use('/ride',ride)

export default router