/* eslint-disable @typescript-eslint/no-unused-vars */
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
// block User
const blockUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id
    const verifyToken = req.user
    const user = await adminService.blockUser(userId, verifyToken as JwtPayload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Blocked Successfully",
        data: user,
    })
})
// Unblock User
const unblockUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id
    const verifyToken = req.user
    const user = await adminService.unblockUser(userId, verifyToken as JwtPayload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User unBlocked Successfully",
        data: user,
    })
})
// block Percel
const blockPercel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id
    const verifyToken = req.user
    const user = await adminService.blockPercel(userId, verifyToken as JwtPayload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Percel Blocked Successfully",
        data: user,
    })
})
// Unblock Percel
const UnblockPercel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id
    const verifyToken = req.user
    const user = await adminService.UnblockPercel(userId, verifyToken as JwtPayload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Percel unBlocked Successfully",
        data: user,
    })
})


//Update Status
const updateParcelStatus = catchAsync(async (req: Request, res: Response) => {
  const parcelId = req.params.id;
  const { status, location, note } = req.body;
  const decoded = req.user; // JWT থেকে পাওয়া user

  const updatedParcel = await adminService.updateParcelStatus(parcelId,{ status, location, note },decoded as JwtPayload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Parcel status updated successfully",
    data: updatedParcel,
  });
});

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
// All percel
const allPercel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {  
    const query = req.query
    const percel = await adminService.allPercel(query as Record<string,string>)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Parcel Retrived Successfully",
        data: percel
    })
})


export const adminController = { updateAdmin,blockUser,unblockUser,blockPercel,UnblockPercel,updateParcelStatus,getAllUsers,allPercel }