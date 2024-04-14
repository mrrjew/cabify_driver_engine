import express,{Request,Response} from "express"
import { appContext } from "../start"

const router = express.Router()

router.put("/accept")

export default router