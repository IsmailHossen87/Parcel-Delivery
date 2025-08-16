import { JwtPayload } from "jsonwebtoken"
import { IUser, UserRole } from "../user/user.interface"
import AppError from "../../errorHelpers/AppError"
import { User } from "../user/user.model"
import httpStatus from "http-status-codes"
import { QueryBuilder } from "../../utils/QueryBuilder"
import { userSearchableFields } from "../user/user.constant"
import { ParcelModel } from "../parcel/parcel.model"
import { parcelSearchableFields } from "./percel.constant"


const updateAdmin = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {
    if (decodedToken.role === UserRole.receiver || decodedToken.role === UserRole.sender) {
        if (userId !== decodedToken.user_ID) {
            throw new AppError(401, "You are not authorized")
        }
    }
    const ifUserExist = await User.findById(userId)

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

export const adminService = { updateAdmin, blockUser, unblockUser, getAllUsers, allPercel }