import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status-codes"
import { parcelService } from "./parcel.service"
import { JwtPayload } from "jsonwebtoken"

const createParcel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const parcel = await parcelService.createParcel(req.body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Parcel Created Successfully",
        data: parcel
    })
})
// Parcel Cancel
const cancelParcel = catchAsync(async (req: Request, res: Response, next: NextFunction) => { 
    const parcelId = req.params.id
    const senderId = req.user
    
    const parcel = await parcelService.cancelParcel(parcelId,senderId as JwtPayload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Parcel Cancell Successfully",
        data: parcel
    })
})
// All percel
const allPercel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {  
    const query = req.query
    const percel = await parcelService.allPercel(query as Record<string,string>)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Parcel created Successfully",
        data: percel
    })
})
// get sender's own parcels
const getmyPercel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user
    const query = req.query
    const percel = await parcelService.getmyPercel(query as Record<string, string> ,decodedToken as JwtPayload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "My Parcels retrived successfully",
        data: percel.data,
        meta: percel.meta
    });
});

export const parcelContoler = {createParcel,cancelParcel,allPercel,getmyPercel}
