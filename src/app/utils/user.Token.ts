import { JwtPayload } from "jsonwebtoken";
import { envVar } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { IUser } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "./jwt";
import httpStauts from "http-status-codes"
import { User } from "../modules/user/user.model";



export const createUserToken = (user: Partial<IUser>) => {
    // Create Token
    const data = {
        user_ID: user._id,
        email: user.email,
        role: user.role
    }
    const accessToken = generateToken(data, envVar.JWT_ACCESS_SECRET, envVar.JWT_ACCESS_EXPIRES)
    const refreshToken = generateToken(data, envVar.JWT_REFRESH_SECRET, envVar.JWT_REFRESH_EXPIRES)

    return {
        accessToken,
        refreshToken   //👇👇👇👇👇
    }

}

// refresh Token diye New Access token generate

export const createNewAccessTokenWithRefresh = async (refreshToken: string) => {
    const verifydRefreshToken = verifyToken(refreshToken, envVar.JWT_REFRESH_SECRET) as JwtPayload

    const userExist = await User.findOne({ email: verifydRefreshToken.email })


    if (!userExist) {
        throw new AppError(httpStauts.BAD_REQUEST, "User does not exist")
    }
    if (userExist.isBlocked) {
        throw new AppError(httpStauts.BAD_REQUEST, `user is Blocked`)
    }
    // Create Token
    const data = {
        user_ID: userExist._id,
        email: userExist.email,
        role: userExist.role
    }
    const accessToken = generateToken(data, envVar.JWT_ACCESS_SECRET, envVar.JWT_ACCESS_EXPIRES)

    return accessToken
}