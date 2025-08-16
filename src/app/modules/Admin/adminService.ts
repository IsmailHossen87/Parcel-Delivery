import { JwtPayload } from "jsonwebtoken"
import { IUser, UserRole } from "../user/user.interface"
import AppError from "../../errorHelpers/AppError"
import { User } from "../user/user.model" 
import httpStatus from "http-status-codes"
import { QueryBuilder } from "../../utils/QueryBuilder"
import { userSearchableFields } from "../user/user.constant"


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
    const newUpdateUser = await User.findByIdAndUpdate(userId,payload,{
        new:true,
        runValidators:true
    })

    return newUpdateUser

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


export const adminService = { updateAdmin,getAllUsers }