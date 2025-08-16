import { NextFunction, Request, Response, Router } from "express";
import { AuthControler } from "./auth.controler";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "../user/user.interface";
import passport from "passport";
import { envVar } from "../../config/env";

const router = Router()
router.post("/register",AuthControler.credentialsLogin)
router.get("/refresh-token",AuthControler.getNewAccessToken)
router.post("/logout", AuthControler.logOut)
router.post("/change-password", checkAuth(...Object.values(UserRole)), AuthControler.changePassword)

// for passport    // /login -> succesful google login -> / frontend
router.get("/google",async(req:Request,res:Response,next:NextFunction)=>{
    const redirect = req.query.redirect || "/"
    passport.authenticate("google",{scope:["profile","email"],state:redirect as string})(req,res,next)
})
// api/v1/auth/google/callback?state=/booking
router.get("/google/callback",passport.authenticate("google", { failureRedirect: `${envVar.FRONTEND_URL}/login?error=There is some issues with your account. Please contact with out support team!` }),AuthControler.googleCallbackContoller)
export const AuthRouter = router