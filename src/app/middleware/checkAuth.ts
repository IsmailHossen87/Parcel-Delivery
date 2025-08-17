import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { envVar } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import httpStatus from "http-status-codes"

export const checkAuth = (...authRole: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization

        if (!accessToken) {
            throw new AppError(403, "No Token Recieved")
        }
        const verifiedToken = verifyToken(accessToken, envVar.JWT_ACCESS_SECRET) as JwtPayload 


        if (!verifiedToken) {
            throw new AppError(403, "User Not Verified Recieved")
        }


        const isUserExist = await User.findOne({ email: verifiedToken.email })


        if (isUserExist?.isBlocked === true) {
            throw new AppError(httpStatus.BAD_REQUEST, "User is Blocked");
        }

         if (!authRole.includes(verifiedToken.role)) {
            throw new AppError(403, "You are not permitted to view this route!!!")
        }

        req.user = verifiedToken
        next()

    } catch (error) {
        console.log("JWT error", error)
        next(error)
    }
}