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
exports.adminController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const adminService_1 = require("./adminService");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const updateAdmin = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const verifyToken = req.user;
    const payload = req.body;
    const user = yield adminService_1.adminService.updateAdmin(userId, payload, verifyToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "User update Successfully",
        data: user,
    });
}));
// block User
const blockUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const verifyToken = req.user;
    const user = yield adminService_1.adminService.blockUser(userId, verifyToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "User Blocked Successfully",
        data: user,
    });
}));
// Unblock User
const unblockUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const verifyToken = req.user;
    const user = yield adminService_1.adminService.unblockUser(userId, verifyToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "User unBlocked Successfully",
        data: user,
    });
}));
// block Percel
const blockPercel = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const verifyToken = req.user;
    const user = yield adminService_1.adminService.blockPercel(userId, verifyToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Percel Blocked Successfully",
        data: user,
    });
}));
// Unblock Percel
const UnblockPercel = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const verifyToken = req.user;
    const user = yield adminService_1.adminService.UnblockPercel(userId, verifyToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Percel unBlocked Successfully",
        data: user,
    });
}));
//Update Status
const updateParcelStatus = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parcelId = req.params.id;
    const { status, location, note } = req.body;
    const decoded = req.user; // JWT থেকে পাওয়া user
    const updatedParcel = yield adminService_1.adminService.updateParcelStatus(parcelId, { status, location, note }, decoded);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Parcel status updated successfully",
        data: updatedParcel,
    });
}));
// ALL USERS GET
const getAllUsers = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield adminService_1.adminService.getAllUsers(query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "All Users Successfully",
        data: result.data,
        meta: result.meta
    });
}));
// All percel
const allPercel = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const percel = yield adminService_1.adminService.allPercel(query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Parcel Retrived Successfully",
        data: percel
    });
}));
exports.adminController = { updateAdmin, blockUser, unblockUser, blockPercel, UnblockPercel, updateParcelStatus, getAllUsers, allPercel };
