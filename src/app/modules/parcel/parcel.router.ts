import { Router } from "express";
import { parcelContoler } from "./parcel.controler";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "../user/user.interface";

const router = Router()
router.post("/create",checkAuth(UserRole.sender),parcelContoler.createParcel) 
router.get("/allPercel",checkAuth(UserRole.admin),parcelContoler.allPercel) 
router.get( "/my-parcels",checkAuth(UserRole.sender,UserRole.receiver),parcelContoler.getmyPercel);
router.post("/cancel/:id",checkAuth(UserRole.sender),parcelContoler.cancelParcel)


export const parcelRouter =router;