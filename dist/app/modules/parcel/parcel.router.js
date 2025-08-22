"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parcelRouter = void 0;
const express_1 = require("express");
const parcel_controler_1 = require("./parcel.controler");
const checkAuth_1 = require("../../middleware/checkAuth");
const user_interface_1 = require("../user/user.interface");
const router = (0, express_1.Router)();
router.post("/", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.sender), parcel_controler_1.parcelContoler.createParcel);
router.get("/me", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.sender, user_interface_1.UserRole.receiver), parcel_controler_1.parcelContoler.getmyPercel);
router.get("/incoming", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.receiver), parcel_controler_1.parcelContoler.getIncomingParcels); //receiver
router.post("/cancel/:id", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.sender), parcel_controler_1.parcelContoler.cancelParcel);
router.post("/confirmed/:id", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.receiver), parcel_controler_1.parcelContoler.confirmedParcel); //receiver
router.get("/status-log/:id", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.UserRole)), parcel_controler_1.parcelContoler.getParcelStatusLog);
router.get("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.sender), parcel_controler_1.parcelContoler.getMyParcelById);
router.get("/incoming/:id", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.receiver), parcel_controler_1.parcelContoler.getMyIncoming); //receiver
exports.parcelRouter = router;
