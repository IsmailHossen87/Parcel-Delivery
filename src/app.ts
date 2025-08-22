import express from "express"
import { router } from "./app/routes"
import { globalErrorHandler } from "./app/middleware/globalErrorHandller"
import notFound from "./app/middleware/notFound"
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session"
import { envVar } from "./app/config/env";
import cors from "cors";
import "./app/config/passport"

const app = express()
app.use(express.json())
// use passport middleware start 
app.use(expressSession({
    secret: envVar.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false

}))
app.use(passport.initialize())
app.use(passport.session())
// set Cookie
app.use(cookieParser())
app.use(cors({
    origin: envVar.FRONTEND_URL,
    credentials: true
}))
app.use("/api/v1", router)

app.get("/",(req,res)=>{
    res.status(200).json({
        message:"Welcome to Parcel Delivary system Backend Project"
    })
})

app.use(globalErrorHandler)
app.use(notFound)

export default app;