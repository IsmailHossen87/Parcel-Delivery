import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { generateTrackingId, IParcel, IStatusLog } from "./parcel.interface";
import { ParcelModel } from "./parcel.model";
import { Types } from "mongoose";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { parcelSearchableFields } from "../Admin/percel.constant";

const createParcel = async (payload: Partial<IParcel>) => {
    if (!payload.senderId) {
        throw new AppError(400, "Sender ID is required");
    }

    // Generate tracking ID
    const trackingId = generateTrackingId();

    // Initial status log
    const initialStatusLog: IStatusLog = {
        status: "Requested",
        updatedBy: new Types.ObjectId(payload.senderId),
    };

    // Create parcel
    const parcel = await ParcelModel.create({
        ...payload,
        trackingId,
        statusLogs: [initialStatusLog],
    });

    return parcel;
};


const cancelParcel = async (parcelId: string, senderPayload: JwtPayload) => {

    const senderId = senderPayload.user_ID //Collect jwt Token
    const parcel = await ParcelModel.findById(parcelId)

    if (!parcel) {
        throw new AppError(404, "Parcel Not found")
    }
    // Ownership check
    if (parcel.senderId.toString() !== senderId.toString()) {
        throw new AppError(403, "You are not permitted to cancel this parcel");
    }

    if (parcel.currentStatus !== "Approved" && parcel.currentStatus !== "Requested") {
        throw new AppError(400, `Parcel cannot be cancelled at status: ${parcel.currentStatus}`);
    }

    // Update
    const cancelLog: IStatusLog = {
        status: "Cancelled",
        updatedBy: new Types.ObjectId(senderId)
    }
    parcel.currentStatus = "Cancelled"
    parcel.statusLogs.push(cancelLog)
    await parcel.save()
    return parcel
};


// confirmed Percel
const confirmedParcel = async (percelId: string, receiver: JwtPayload) => {
    const percel = await ParcelModel.findById(percelId)
    if (!percel) {
        throw new AppError(404, "Parcel Not found")
    }
    if (receiver.role !== "receiver") {
        throw new AppError(404, "You are not Permitted to confirm delivery")
    }
    if (percel.currentStatus === "Delivered" || percel.currentStatus === "Cancelled") {
          throw new AppError(400, `Parcel is already ${percel.currentStatus}`);
    }


    percel.currentStatus = "Delivered";
    percel.statusLogs.push({
        status: "Delivered",
        updatedBy: receiver.user_ID
    })

    await percel.save()
    return percel

}

// myPercel
const getmyPercel = async (query: Record<string, string>, decodedToken: JwtPayload) => {
    let filter = {}
    if (decodedToken.role === "sender") {
        filter = { senderId: decodedToken.user_ID }
    } else if (decodedToken.role === "receiver") {
        filter = { receiverId: decodedToken.user_ID }
    }

    const queryBuilder = new QueryBuilder(ParcelModel.find(filter), query)
    const percelData = queryBuilder
        .filter()
        .search(parcelSearchableFields)
        .sort()
        .fields()
        .paginate();

    const [data, meta] = await Promise.all([
        percelData.build(),
        queryBuilder.getMeta()
    ])
    return {
        data,
        meta
    }
}
export const parcelService = { createParcel, cancelParcel, getmyPercel, confirmedParcel };
