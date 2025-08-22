/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status-codes"
import { AuthService } from "./auth.service"
import { NextFunction, Request, Response } from "express"
import { setAuthCookies } from "../../utils/setCookie"
import AppError from "../../errorHelpers/AppError"
import { createUserToken } from "../../utils/user.Token"
import { envVar } from "../../config/env"
import passport from "passport"
import { JwtPayload } from "jsonwebtoken"

// Create Token and 
const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    // stape -1 
    // const loginData = await AuthService.credentialsLogin(req.body)   EKHANE ACCESStoken and SECRETtoken ase

    // stap1-2 // set Cookies 
    // setAuthCookies(res, loginData) 


    // easyWAY
    passport.authenticate("local", async (err: any, user: any, info: any) => {

        if (err) {
            return next(new AppError(500, err.message || "Internal Server Error"));
        }

        if (!user) {
            return next(new AppError(401, info?.message || "Invalid credentials"));
        }

        const userTokens = await createUserToken(user)

        // delete user.toObject().password

        const { password: pass, ...rest } = user.toObject()


        setAuthCookies(res, userTokens)

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "User Logged In Successfully",
            data: {
                accessToken: userTokens.accessToken,
                refreshToken: userTokens.refreshToken,
                user: rest

            },
        })
    })(req, res, next)
})
const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // const refreshToken = req.headers.authorization       //default Check

    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
        throw new AppError(httpStatus.BAD_REQUEST, "No refresh token recieved from cookies")
    }

    const tokenInfo = await AuthService.getNewAccessToken(refreshToken as string)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "New generate Token Sucessfully",
        data: tokenInfo
    })

})
// logOut
const logOut = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User LoogedOut Sucessfully",
        data: null
    })

})
// ChangePassword
const changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const oldPassword = req.body.oldPassword
    const newPassword = req.body.newPassword
    const decodedToken = req.user

    const changePass = await AuthService.changePassword(newPassword, oldPassword, decodedToken as JwtPayload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password Changed Sucessfully",
        data: null
    })

})
// ChangePassword
const setPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload 
    const { password } = req.body;

    await AuthService.setPassword(decodedToken.user_ID as string, password as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password Changed Successfully",
        data: null,
    })

})


// Passprot
const googleCallbackContoller = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let redirectTo = req.query.state ? req.query.state as string : ""
    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1)
    }

    const user = req.user
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found")
    }
    const token = createUserToken(user)
    setAuthCookies(res, token)

    res.redirect(`${envVar.FRONTEND_URL}/${redirectTo}`)

})
export const AuthControler = { credentialsLogin, getNewAccessToken, logOut,setPassword, changePassword, googleCallbackContoller }