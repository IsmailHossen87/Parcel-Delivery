import { Schema, model } from "mongoose";
import { IAuthProvider, IUser, UserRole } from "./user.interface";

const authProviderSchema = new Schema<IAuthProvider>({
  provider: { type: String, required: true },
  providerId: { type: String, required: true }
}, {
  versionKey: false,
  _id: false
})


const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    address: { type: String },
    picture: { type: String },
    role: { type: String, enum: ["admin", "sender", "receiver"], default:UserRole.sender },
    isBlocked: { type: Boolean, default: false },
    auths: [authProviderSchema]
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const User = model<IUser>("User", userSchema);
