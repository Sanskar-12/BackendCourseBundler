import express from "express"
import { Contact, GetDashStatus, RequestCourse } from "../controllers/OtherControllers.js"
import {adminAuth, isAuthenticated} from '../middlewares/auth.js'

const router =express.Router()

//Contact
router.post("/contact",Contact)

//Request
router.post("/request",RequestCourse)

//Dashboard Stats
router.get("/dashboardstats",isAuthenticated,adminAuth,GetDashStatus)


export default router