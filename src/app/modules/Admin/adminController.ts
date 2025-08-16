import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { adminService } from "./adminService"
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";

const updateAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id
    const verifyToken = req.user
    const payload = req.body
    const user = await adminService.updateAdmin(userId, payload, verifyToken as JwtPayload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User update Successfully",
        data: user,
    })
})

// ALL USERS GET
const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query
    const result = await adminService.getAllUsers(query as Record<string, string>)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All Users Successfully",
        data: result.data,
        meta: result.meta
    })


})

export const adminController = { updateAdmin,getAllUsers }