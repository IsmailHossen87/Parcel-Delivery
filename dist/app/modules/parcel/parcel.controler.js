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
exports.parcelContoler = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const parcel_service_1 = require("./parcel.service");
const createParcel = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.user;
    const parcel = yield parcel_service_1.parcelService.createParcel(payload, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Parcel Created Successfully",
        data: parcel
    });
}));
// Parcel Cancel
const cancelParcel = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const parcelId = req.params.id;
    const senderId = req.user;
    const parcel = yield parcel_service_1.parcelService.cancelParcel(parcelId, senderId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Parcel Cancell Successfully",
        data: parcel
    });
}));
// confirmed Parcel
const confirmedParcel = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const parcelId = req.params.id;
    const receiverId = req.user;
    const parcel = yield parcel_service_1.parcelService.confirmedParcel(parcelId, receiverId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Parcel Confirmed Successfully",
        data: parcel
    });
}));
// get sender's own parcels
const getmyPercel = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const query = req.query;
    const percel = yield parcel_service_1.parcelService.getmyPercel(query, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "My Parcels retrived successfully",
        data: percel.data,
        meta: percel.meta
    });
}));
// getMyParcelById
const getMyParcelById = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const id = req.params.id;
    const percel = yield parcel_service_1.parcelService.getMyParcelById(id, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Parcel retrieved successfully",
        data: percel
    });
}));
// Get Incoming Percel 
const getIncomingParcels = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const percel = yield parcel_service_1.parcelService.getIncomingParcels(decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Incoming parcels retrieved successfully",
        data: percel
    });
}));
// Get MYIncoming Percel 
const getMyIncoming = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const paramsId = req.params.id;
    const percel = yield parcel_service_1.parcelService.getMyIncoming(paramsId, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: " My Incoming parcels retrieved successfully",
        data: percel
    });
}));
// Status Log
const getParcelStatusLog = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const parcelId = req.params.id;
    const decodedToken = req.user;
    const statusLogs = yield parcel_service_1.parcelService.getParcelStatusLog(parcelId, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Parcel status logs retrieved successfully",
        data: statusLogs,
    });
}));
exports.parcelContoler = { createParcel, cancelParcel, getmyPercel, getMyParcelById, getMyIncoming, getIncomingParcels, confirmedParcel, getParcelStatusLog };
