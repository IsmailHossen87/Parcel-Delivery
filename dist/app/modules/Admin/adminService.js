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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminService = void 0;
const user_interface_1 = require("../user/user.interface");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_model_1 = require("../user/user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const user_constant_1 = require("../user/user.constant");
const parcel_model_1 = require("../parcel/parcel.model");
const percel_constant_1 = require("./percel.constant");
const updateAdmin = (userId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (decodedToken.role === user_interface_1.UserRole.receiver || decodedToken.role === user_interface_1.UserRole.sender) {
        if (userId !== decodedToken.user_ID) {
            throw new AppError_1.default(401, "You are not authorized");
        }
    }
    const ifUserExist = yield user_model_1.User.findById(userId);
    if (!ifUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "User Not available");
    }
    if (payload.role) {
        if (decodedToken.role === user_interface_1.UserRole.sender || decodedToken.role === user_interface_1.UserRole.receiver) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
    }
    const newUpdateUser = yield user_model_1.User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true
    });
    return newUpdateUser;
});
// blocked
const blockUser = (userId, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (decodedToken.role === user_interface_1.UserRole.receiver || decodedToken.role === user_interface_1.UserRole.sender) {
        if (userId !== decodedToken.user_ID) {
            throw new AppError_1.default(401, "You are not authorized");
        }
    }
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(401, "User not found");
    }
    user.isBlocked = true;
    user.save();
    const _a = user.toObject(), { password } = _a, userResult = __rest(_a, ["password"]);
    return userResult;
});
// unblocked
const unblockUser = (userId, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (decodedToken.role === user_interface_1.UserRole.receiver || decodedToken.role === user_interface_1.UserRole.sender) {
        if (userId !== decodedToken.user_ID) {
            throw new AppError_1.default(401, "You are not authorized");
        }
    }
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(401, "User not found");
    }
    user.isBlocked = false;
    user.save();
    const _a = user.toObject(), { password } = _a, userResult = __rest(_a, ["password"]);
    return userResult;
});
// Block Percel
const blockPercel = (percelId, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (decodedToken.role !== "admin") {
        throw new AppError_1.default(401, "Only admin Can Blocked the Percel");
    }
    const percel = yield parcel_model_1.ParcelModel.findById(percelId);
    if (!percel) {
        throw new AppError_1.default(404, "Percel Not found");
    }
    percel.isBlocked = true;
    percel.save();
    return percel;
});
// UnBlock Percel
const UnblockPercel = (percelId, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (decodedToken.role !== "admin") {
        throw new AppError_1.default(401, "Only admin Can Blocked the Percel");
    }
    const percel = yield parcel_model_1.ParcelModel.findById(percelId);
    if (!percel) {
        throw new AppError_1.default(404, "Percel Not found");
    }
    percel.isBlocked = false;
    percel.save();
    return percel;
});
// update Status
const updateParcelStatus = (parcelId, payload, decoded) => __awaiter(void 0, void 0, void 0, function* () {
    if (decoded.role !== user_interface_1.UserRole.admin) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Only admin can update parcel status");
    }
    const parcel = yield parcel_model_1.ParcelModel.findById(parcelId);
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    }
    // নতুন স্ট্যাটাস বসানো
    parcel.currentStatus = payload.status;
    parcel.statusLogs.push({
        status: payload.status,
        location: payload.location,
        note: payload.note,
        updatedBy: decoded.user_ID,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    });
    yield parcel.save();
    return parcel;
});
// get All Users
const getAllUsers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(user_model_1.User.find(), query);
    const userData = queryBuilder
        .filter()
        .search(user_constant_1.userSearchableFields)
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        userData.build(),
        queryBuilder.getMeta()
    ]);
    return {
        data,
        meta
    };
});
// get All percel
const allPercel = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(parcel_model_1.ParcelModel.find(), query);
    const percelData = queryBuilder
        .filter()
        .search(percel_constant_1.parcelSearchableFields)
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        percelData.build(),
        queryBuilder.getMeta()
    ]);
    return {
        data,
        meta
    };
});
exports.adminService = { updateAdmin, blockUser, blockPercel, unblockUser, updateParcelStatus, UnblockPercel, getAllUsers, allPercel };
