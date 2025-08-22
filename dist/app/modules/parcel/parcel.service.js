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
exports.parcelService = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const parcel_interface_1 = require("./parcel.interface");
const parcel_model_1 = require("./parcel.model");
const mongoose_1 = require("mongoose");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const percel_constant_1 = require("../Admin/percel.constant");
const createParcel = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token.user_ID) {
        throw new AppError_1.default(400, "You are Not authorized");
    }
    if (token.role === "admin" && token.role === "receiver") {
        throw new AppError_1.default(400, "Only sender Can create Percel");
    }
    const senderId = token.user_ID;
    // Generate tracking ID
    const trackingId = (0, parcel_interface_1.generateTrackingId)();
    // Initial status log
    const initialStatusLog = {
        status: "Requested",
        updatedBy: new mongoose_1.Types.ObjectId(payload.senderId),
    };
    // Create parcel
    const parcel = yield parcel_model_1.ParcelModel.create(Object.assign(Object.assign({}, payload), { senderId,
        trackingId, statusLogs: [initialStatusLog] }));
    return parcel;
});
const cancelParcel = (parcelId, senderPayload) => __awaiter(void 0, void 0, void 0, function* () {
    const senderId = senderPayload.user_ID; //Collect jwt Token
    const parcel = yield parcel_model_1.ParcelModel.findById(parcelId);
    if (!parcel) {
        throw new AppError_1.default(404, "Parcel Not found");
    }
    // Ownership check
    if (parcel.senderId.toString() !== senderId.toString()) {
        throw new AppError_1.default(403, "You are not permitted to cancel this parcel");
    }
    if (parcel.currentStatus !== "Approved" && parcel.currentStatus !== "Requested") {
        throw new AppError_1.default(400, `Parcel cannot be cancelled at status: ${parcel.currentStatus}`);
    }
    // Update
    const cancelLog = {
        status: "Cancelled",
        updatedBy: new mongoose_1.Types.ObjectId(senderId)
    };
    parcel.currentStatus = "Cancelled";
    parcel.statusLogs.push(cancelLog);
    yield parcel.save();
    return parcel;
});
// confirmed Percel
const confirmedParcel = (percelId, receiver) => __awaiter(void 0, void 0, void 0, function* () {
    const percel = yield parcel_model_1.ParcelModel.findById(percelId);
    if (!percel) {
        throw new AppError_1.default(404, "Parcel Not found");
    }
    if (receiver.role !== "receiver") {
        throw new AppError_1.default(404, "You are not Permitted to confirm delivery");
    }
    if (percel.currentStatus === "Delivered" || percel.currentStatus === "Cancelled") {
        throw new AppError_1.default(400, `Parcel is already ${percel.currentStatus}`);
    }
    percel.currentStatus = "Delivered";
    percel.statusLogs.push({
        status: "Delivered",
        updatedBy: receiver.user_ID
    });
    yield percel.save();
    return percel;
});
// myPercel
const getmyPercel = (query, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    let filter = {};
    if (decodedToken.role === "sender") {
        filter = { senderId: decodedToken.user_ID };
    }
    else if (decodedToken.role === "receiver") {
        filter = { receiverId: decodedToken.user_ID };
    }
    const queryBuilder = new QueryBuilder_1.QueryBuilder(parcel_model_1.ParcelModel.find(filter), query);
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
// getMyParcelById
const getMyParcelById = (id, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const senderid = decodedToken.user_ID;
    const percel = yield parcel_model_1.ParcelModel.findById(id);
    if (!percel) {
        throw new AppError_1.default(404, "My Percel Not found");
    }
    if (percel.senderId.toString() !== senderid) {
        throw new AppError_1.default(403, "You are not allowed to view this parcel");
    }
    return percel;
});
// getMyParcelById
const getIncomingParcels = (decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const receiverID = decodedToken.user_ID;
    console.log(receiverID);
    const percelReceiverId = yield parcel_model_1.ParcelModel.find({ receiverId: receiverID });
    if (!percelReceiverId) {
        throw new AppError_1.default(404, "Incommig Data not Avaiable");
    }
    return percelReceiverId;
});
// getMyParcelById
const getMyIncoming = (paramsId, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = decodedToken.user_ID;
    const parcel = yield parcel_model_1.ParcelModel.findById(paramsId);
    if (!parcel) {
        throw new AppError_1.default(404, "Parcel not found");
    }
    if (parcel.receiverId.toString() !== userId) {
        throw new AppError_1.default(403, "You are not authorized to view this parcel");
    }
    return parcel;
});
// status Log
const getParcelStatusLog = (parcelId, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const parcel = yield parcel_model_1.ParcelModel.findById(parcelId).populate("statusLogs.updatedBy", "name email role");
    if (!parcel) {
        throw new AppError_1.default(404, "Parcel not found");
    }
    // Authorization check → sender / receiver নিজের parcel দেখবে, admin সব দেখতে পারবে
    if (decodedToken.role === "sender" && parcel.senderId.toString() !== decodedToken.user_ID) {
        throw new AppError_1.default(403, "You are not authorized to view this parcel log");
    }
    if (decodedToken.role === "receiver" && ((_a = parcel.receiverId) === null || _a === void 0 ? void 0 : _a.toString()) !== decodedToken.user_ID) {
        throw new AppError_1.default(403, "You are not authorized to view this parcel log");
    }
    return parcel.statusLogs;
});
exports.parcelService = { createParcel, cancelParcel, getmyPercel, getMyParcelById, getMyIncoming, getIncomingParcels, confirmedParcel, getParcelStatusLog };
