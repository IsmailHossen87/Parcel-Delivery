import { Router } from "express";
import { parcelContoler } from "./parcel.controler";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "../user/user.interface";
import { object } from "zod";

const router = Router()
router.post("/",checkAuth(UserRole.sender),parcelContoler.createParcel) 
router.get( "/me",checkAuth(UserRole.sender,UserRole.receiver),parcelContoler.getmyPercel);
router.post("/cancel/:id",checkAuth(UserRole.sender),parcelContoler.cancelParcel)
router.post("/confirmed/:id",checkAuth(UserRole.receiver),parcelContoler.confirmedParcel)
router.get("/:id/status-log",checkAuth(...Object.values(UserRole)),parcelContoler.getParcelStatusLog);


export const parcelRouter =router;