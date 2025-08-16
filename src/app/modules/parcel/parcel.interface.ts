import mongoose from "mongoose";

export type ParcelStatus = 'Requested' | 'Approved' | 'Dispatched' | 'In Transit' | 'Delivered' | 'Cancelled' | 'Held' | 'Returned';

export const generateTrackingId = (): string => {
    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const randomNum = Math.floor(100000 + Math.random() * 900000);

    return `TRK-${yyyy}${mm}${dd}-${randomNum}`;
}

export interface IStatusLog {
  status: ParcelStatus;
  location?: string;
  note?: string;
  updatedBy: mongoose.Types.ObjectId | string; 
}

export interface IParcel extends mongoose.Document {
  trackingId: string;
  type: string;
  weight: number;
  senderId: mongoose.Types.ObjectId; // <-- এখানে পরিবর্তন
  receiverId: mongoose.Types.ObjectId; // <-- এখানে পরিবর্তন
  senderAddress: string;
  receiverAddress: string;
  deliveryFee: number;
  currentStatus: ParcelStatus;
  statusLogs: IStatusLog[];
  isBlocked?: boolean;
}
