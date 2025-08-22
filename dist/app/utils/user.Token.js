"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewAccessTokenWithRefresh = exports.createUserToken = void 0;
const env_1 = require("../config/env");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const jwt_1 = require("./jwt");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_model_1 = require("../modules/user/user.model");
const createUserToken = (user) => {
    // Create Token
    const data = {
        user_ID: user._id,
        email: user.email,
        role: user.role
    };
    const accessToken = (0, jwt_1.generateToken)(data, env_1.envVar.JWT_ACCESS_SECRET, env_1.envVar.JWT_ACCESS_EXPIRES);
    const refreshToken = (0, jwt_1.generateToken)(data, env_1.envVar.JWT_REFRESH_SECRET, env_1.envVar.JWT_REFRESH_EXPIRES);
    return {
        accessToken,
        refreshToken //👇👇👇👇👇
    };
};
exports.createUserToken = createUserToken;
// refresh Token diye New Access token generate
const createNewAccessTokenWithRefresh = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const verifydRefreshToken = (0, jwt_1.verifyToken)(refreshToken, env_1.envVar.JWT_REFRESH_SECRET);
    const userExist = yield user_model_1.User.findOne({ email: verifydRefreshToken.email });
    if (!userExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User does not exist");
    }
    if (userExist.isBlocked) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `user is Blocked`);
    }
    // Create Token
    const data = {
        user_ID: userExist._id,
        email: userExist.email,
        role: userExist.role
    };
    const accessToken = (0, jwt_1.generateToken)(data, env_1.envVar.JWT_ACCESS_SECRET, env_1.envVar.JWT_ACCESS_EXPIRES);
    return accessToken;
});
exports.createNewAccessTokenWithRefresh = createNewAccessTokenWithRefresh;
