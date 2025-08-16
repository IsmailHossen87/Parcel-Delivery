export interface IAuthProvider {
    provider: "google" | "credentials";  
    providerId: string;
}

export enum UserRole {
    admin = "admin",
    sender = "sender",
    receiver = "receiver"
}

export interface IUser {
    _id?: string;
    name: string;
    email: string;
    picture?:string;
    password: string;
    role: UserRole;
    auths: IAuthProvider[];
    address?:string;
    isBlocked: boolean;
}
