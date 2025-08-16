import mongoose, { Schema } from "mongoose";
import { IParcel, IStatusLog } from "./parcel.interface";

// Status Log Subschema
const StatusLogSchema = new Schema<IStatusLog>(
    {
        status: {
            type: String,
            enum: ["Requested", "Approved", "Dispatched", "In Transit", "Delivered", "Cancelled", "Held", "Returned"],
            required: true,
        },
        location: { type: String },
        note: { type: String },
        updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    {
        versionKey: false,
        _id: false 
    }
);

const ParcelSchema = new Schema<IParcel>(
    {   
        trackingId: { type: String, required: true, unique: true },
        type: { type: String, required: true },
        weight: { type: Number, required: true },
        senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        receiverId: { type: Schema.Types.ObjectId, ref: "User" },
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
    },
    {
        versionKey: false,
        timestamps: true
    }
);

export const ParcelModel = mongoose.model<IParcel>("Parcel", ParcelSchema);
