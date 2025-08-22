"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Status Log Subschema
const StatusLogSchema = new mongoose_1.Schema({
    status: {
        type: String,
        enum: ["Requested", "Approved", "Dispatched", "In Transit", "Delivered", "Cancelled", "Held", "Returned"],
        required: true,
    },
    location: { type: String },
    note: { type: String },
    updatedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
}, {
    versionKey: false,
    _id: false,
    timestamps: true
});
const ParcelSchema = new mongoose_1.Schema({
    trackingId: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    weight: { type: Number, required: true },
    senderId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    senderAddress: { type: String, required: true },
    receiverAddress: { type: String, required: true },
    deliveryFee: { type: Number, required: true },
    currentStatus: {
        type: String,
        enum: ["Requested", "Approved", "Dispatched", "In Transit", "Delivered", "Cancelled", "Held", "Returned"],
        default: "Requested",
    },
    statusLogs: [StatusLogSchema],
    isBlocked: { type: Boolean, default: false },
}, {
    versionKey: false,
    timestamps: true
});
exports.ParcelModel = mongoose_1.default.model("Parcel", ParcelSchema);
