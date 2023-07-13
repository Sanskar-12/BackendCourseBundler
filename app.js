import { config } from "dotenv"
import express from "express"
import course from "./routes/CourseRoutes.js"
import user from "./routes/UserRoutes.js"
import payments from "./routes/PaymentRoutes.js"
import other from "./routes/OtherRoutes.js"
import { ErrorMiddleware } from "./middlewares/Error.js"
import cookieParser from "cookie-parser"
import cors from "cors"

config({path:"./config/config.env"})

const app=express()

//Middlewares
app.use(express.json())
app.use(express.urlencoded({
    extended:true,
}))
app.use(cookieParser())
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true,
    methods:["GET","POST","PUT","DELETE"],
}))


//use Routes
app.use("/api/v1",course)
app.use("/api/v1",user)
app.use("/api/v1",payments)
app.use("/api/v1",other)
app.get("/",(req,res)=>{
    res.send(`<h1>Site is Working fine, Visit on <a href=${process.env.FRONTEND_URL}>Click Here</a></h1>`)
})

export default app

//middlewares
app.use(ErrorMiddleware)