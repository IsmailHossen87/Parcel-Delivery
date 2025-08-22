/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { userService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes"
import { JwtHeader, JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await userService.createUser(req.body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Created Successfully",
        data: user,
    })


})
// UpdateUser
const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // const userId = req.user as JwtPayload
    const verifiedToken = req.user as JwtPayload
    const user = await userService.updateUser(verifiedToken.user_ID , req.body, verifiedToken )

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Update Successfully",
        data: user,
    })

})
//SINGLE USER GET
const getSingleUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload 


    if (decodedToken.role === "sender" || decodedToken.role === "receiver" || decodedToken.role === "admin") {

        if (!decodedToken.user_ID) {
            throw new AppError(403, "You are not allowed to access this resource");
        }
    }

    const result = await userService.getSingleUser(decodedToken.user_ID as string)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Retrived Successfully",
        data: result
    })

})



export const userControler = { createUser, updateUser, getSingleUser }