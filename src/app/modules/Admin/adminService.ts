/* eslint-disable @typescript-eslint/no-unused-vars */
import { JwtPayload } from "jsonwebtoken"
import { IUser, UserRole } from "../user/user.interface"
import AppError from "../../errorHelpers/AppError"
import { User } from "../user/user.model"
import httpStatus from "http-status-codes"
import { QueryBuilder } from "../../utils/QueryBuilder"
import { userSearchableFields } from "../user/user.constant"
import { ParcelModel } from "../parcel/parcel.model"
import { parcelSearchableFields } from "./percel.constant"
import { ParcelStatus } from "../parcel/parcel.interface"


const updateAdmin = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {
    if (decodedToken.role === UserRole.receiver || decodedToken.role === UserRole.sender) {
        if (userId !== decodedToken.user_ID) {
            throw new AppError(401, "You are not authorized")
        }
    }
    const ifUserExist = await User.findById(userId) 

    if(!ifUserExist){
         throw new AppError(httpStatus.FORBIDDEN, "User Not available");
    }

    if (payload.role) {
        if (decodedToken.role === UserRole.sender || decodedToken.role === UserRole.receiver) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }
    }
    const newUpdateUser = await User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true
    })

    return newUpdateUser

}
// blocked
const blockUser = async (userId: string, decodedToken: JwtPayload) => {
    if (decodedToken.role === UserRole.receiver || decodedToken.role === UserRole.sender) {
        if (userId !== decodedToken.user_ID) {
            throw new AppError(401, "You are not authorized")
        }
    }
    const user = await User.findById(userId)
    if (!user) {
        throw new AppError(401, "User not found")
    }
    user.isBlocked = true
    user.save()
    const { password, ...userResult } = user.toObject()
    return userResult

}
// unblocked
const unblockUser = async (userId: string, decodedToken: JwtPayload) => {
    if (decodedToken.role === UserRole.receiver || decodedToken.role === UserRole.sender) {
        if (userId !== decodedToken.user_ID) {
            throw new AppError(401, "You are not authorized")
        }
    }
    const user = await User.findById(userId)
    if (!user) {
        throw new AppError(401, "User not found")
    }

    user.isBlocked = false
    user.save()
    const { password, ...userResult } = user.toObject()
    return userResult

}
// Block Percel
const blockPercel = async (percelId: string, decodedToken: JwtPayload) => {
    if (decodedToken.role !== "admin") {
        throw new AppError(401, "Only admin Can Blocked the Percel")
    }
    const percel = await ParcelModel.findById(percelId)
    if (!percel) {
        throw new AppError(404, "Percel Not found")
    }
    percel.isBlocked = true
    percel.save()
    return percel
}
// UnBlock Percel
const UnblockPercel = async (percelId: string, decodedToken: JwtPayload) => {
    if (decodedToken.role !== "admin") {
        throw new AppError(401, "Only admin Can Blocked the Percel")
    }
    const percel = await ParcelModel.findById(percelId)
    if (!percel) {
        throw new AppError(404, "Percel Not found")
    }
    percel.isBlocked = false
    percel.save()
    return percel
}
// update Status
const updateParcelStatus = async (parcelId: string, payload: { status: string; location?: string; note?: string }, decoded: JwtPayload) => {

    if (decoded.role !== UserRole.admin) {
        throw new AppError(httpStatus.FORBIDDEN, "Only admin can update parcel status");
    }

    const parcel = await ParcelModel.findById(parcelId);
    if (!parcel) {
        throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
    }

    // নতুন স্ট্যাটাস বসানো
    parcel.currentStatus = payload.status as ParcelStatus


    parcel.statusLogs.push({
        status: payload.status,
        location: payload.location,
        note: payload.note,
        updatedBy: decoded.user_ID,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    await parcel.save();

    return parcel;
};

// get All Users
const getAllUsers = async (query: Record<string, string>) => {

    const queryBuilder = new QueryBuilder(User.find(), query)
    const userData = queryBuilder
        .filter()
        .search(userSearchableFields)
        .sort()
        .fields()
        .paginate();

    const [data, meta] = await Promise.all([
        userData.build(),
        queryBuilder.getMeta()
    ])
    return {
        data,
        meta
    }
}
// get All percel
const allPercel = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(ParcelModel.find(), query)
    const percelData = queryBuilder
        .filter()
        .search(parcelSearchableFields)
        .sort()
        .fields()
        .paginate();

    const [data, meta] = await Promise.all([
        percelData.build(),
        queryBuilder.getMeta()
    ])
    return {
        data,
        meta
    }
}

export const adminService = { updateAdmin, blockUser, blockPercel, unblockUser, updateParcelStatus, UnblockPercel, getAllUsers, allPercel }