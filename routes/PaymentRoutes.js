import express from "express"
import { isAuthenticated } from "../middlewares/auth.js"
import { Buysubscription, CancelSubscription, GetRazorpayKey, paymentVerification } from "../controllers/paymentControllers.js"

const router=express.Router()

//Buy Subscription
router.get("/payment/buy",isAuthenticated,Buysubscription)

//Payment Verification
router.post("/payment/paymentverification",isAuthenticated,paymentVerification)

//Get razorpay Key
router.get("/payment/getrazorkey",GetRazorpayKey)

//Cancel Subscription
router.delete("/payment/cancel",isAuthenticated,CancelSubscription)



export default router