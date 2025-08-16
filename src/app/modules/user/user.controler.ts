import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { userService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes"
import { JwtPayload } from "jsonwebtoken";
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
    const userId = req.params.id
    const verifiedToken = req.user
    const user = await userService.updateUser(userId, req.body, verifiedToken as JwtPayload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Update Successfully",
        data: user,
    })

})
//SINGLE USER GET
const getSingleUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const id = req.params.id;
    const decodedToken = req.user as JwtPayload 


    if (decodedToken.role === "sender" || decodedToken.role === "receiver" || decodedToken.role === "admin") {

        if (id !== decodedToken.user_ID) {
            throw new AppError(403, "You are not allowed to access this resource");
        }
    }

    const result = await userService.getSingleUser(id)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Retrived Successfully",
        data: result
    })

})



export const userControler = { createUser, updateUser, getSingleUser }