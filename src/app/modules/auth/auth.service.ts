import AppError from "../../errorHelpers/AppError"
import { User } from "../user/user.model"
import httpStatus from "http-status-codes"
import bcryptjs from "bcryptjs"
import { IAuthProvider, IUser } from "../user/user.interface"
import { JwtPayload } from "jsonwebtoken"
import { createNewAccessTokenWithRefresh, createUserToken } from "../../utils/user.Token"
import { envVar } from "../../config/env"

// CreateToken
const credentialsLogin = async (payload: Partial<IUser>) => {
    const { email, password } = payload

    const isUserExist = await User.findOne({ email })
    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist")
    }

    const isPasswordMatch = await bcryptjs.compare(password as string, isUserExist.password)

    if (!isPasswordMatch) {
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password")
    }
    // connect    utils/user.Token.ts
    const userToken = createUserToken(isUserExist)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, ...rest } = isUserExist.toObject()

    return {
        accessToken: userToken.accessToken,
        refreshToken: userToken.refreshToken,
        user: rest
    }
}

// Generate New Token
const getNewAccessToken = async (refreshToken: string) => {
    const newGenerateToken = await createNewAccessTokenWithRefresh(refreshToken)  //link utils/userToken

    return {
        accessToken: newGenerateToken
    }
}
// Password Changed
const changePassword = async (newPassword: string, oldPassword: string, decodedToken: JwtPayload) => {
    const user = await User.findById(decodedToken.user_ID)
    const isOldPassword = await bcryptjs.compare(oldPassword, user!.password as string)
    if (!isOldPassword) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Old Password does not match");
    }
    user!.password = await bcryptjs.hash(newPassword, Number(envVar.BCRYPT_SALT_ROUND))
    user!.save();

}

const setPassword = async (userId :string, plainPass: string) => {
    const user = await User.findById(userId)
    if (!user) {
        throw new AppError(404, "User not found");
    }
    if (user.password && user.auths.some(providerObject => providerObject.provider === "google")) {
        throw new AppError(httpStatus.BAD_REQUEST, "You have already set you password. Now you can change the password from your profile password update")
    }

    const hashedPassword = await bcryptjs.hash(plainPass, Number(envVar.BCRYPT_SALT_ROUND))
    const credentialProvider: IAuthProvider = {
        provider: "credentials",
        providerId: user.email
    }
    const auths: IAuthProvider[] = [...user.auths, credentialProvider] 
    user.password = hashedPassword
    user.auths =auths
    await user.save()
}

export const AuthService = { credentialsLogin, getNewAccessToken, changePassword, setPassword }