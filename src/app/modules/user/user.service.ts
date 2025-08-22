import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, UserRole } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes"
import bcryptjs from "bcryptjs"
import { envVar } from "../../config/env";
import mongoose from "mongoose";
import { JwtPayload } from "jsonwebtoken";

const createUser = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload
    const isUserExist = await User.findOne({ email })

    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist")
    }
    const hashePassword = await bcryptjs.hash(password as string, Number(envVar.BCRYPT_SALT_ROUND)) 
    const authProvider: IAuthProvider = { provider: "credentials", providerId: email as string }

    const user = await User.create({
        email,
        password: hashePassword,
        auths:[authProvider],
        ...rest
    })
    return user;
}
// Update User
const updateUser = async (userId: JwtPayload, payload: Partial<IUser>, decodedToken: JwtPayload) => {
    // check-1
    if (decodedToken.role === UserRole.receiver || decodedToken.role === UserRole.sender) {
        if (userId !== decodedToken.user_ID) {
            throw new AppError(401, "You are not authorized")
        }
    }
    //   check-2
    const userExist = await User.findById(userId)
    if (!userExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }
    // role আপডেট শুধু admin পারবে
    if (payload.role && decodedToken.role !== UserRole.admin) {
        throw new AppError(httpStatus.FORBIDDEN, "Only admin can update the role");
    }
    // finally update User
    const updateUser = await User.findByIdAndUpdate(userId,payload,{new:true,runValidators:true})
    return updateUser;
}

// get Single Users
const getSingleUser = async (id: string) => { 
        
    if (!mongoose.Types.ObjectId.isValid(id )) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid User ID");
    }
    const user = await User.findById(id).select("-password")
    return { user }
}



export const userService = { createUser, updateUser, getSingleUser }