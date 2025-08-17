import { Router } from "express";
import { parcelContoler } from "./parcel.controler";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "../user/user.interface";


const router = Router()
router.post("/",checkAuth(UserRole.sender),parcelContoler.createParcel) 
router.get("/me",checkAuth(UserRole.sender,UserRole.receiver),parcelContoler.getmyPercel);
router.get("/incoming",checkAuth(UserRole.receiver),parcelContoler.getIncomingParcels);  //receiver

router.post("/cancel/:id",checkAuth(UserRole.sender),parcelContoler.cancelParcel) 
router.post("/confirmed/:id",checkAuth(UserRole.receiver),parcelContoler.confirmedParcel)  //receiver
router.get("/:id/status-log",checkAuth(...Object.values(UserRole)),parcelContoler.getParcelStatusLog);

router.get("/:id",checkAuth(UserRole.sender),parcelContoler.getMyParcelById);
router.get("/incoming/:id",checkAuth(UserRole.receiver),parcelContoler.getMyIncoming); //receiver


export const parcelRouter =router;