"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = require("express");
const checkAuth_1 = require("../../middleware/checkAuth");
const user_interface_1 = require("../user/user.interface");
const adminController_1 = require("./adminController");
const router = (0, express_1.Router)();
router.get("/users", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.admin), adminController_1.adminController.getAllUsers);
router.get("/parcels", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.admin), adminController_1.adminController.allPercel);
router.patch("/parcels/status/:id", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.admin), adminController_1.adminController.updateParcelStatus);
router.patch("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.admin), adminController_1.adminController.updateAdmin);
// singlePercel
router.patch("/user/blocked/:id", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.admin), adminController_1.adminController.blockUser);
router.patch("/user/unblocked/:id", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.admin), adminController_1.adminController.unblockUser);
router.patch("/percel/blocked/:id", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.admin), adminController_1.adminController.blockPercel);
router.patch("/percel/unblocked/:id", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.admin), adminController_1.adminController.UnblockPercel);
exports.adminRouter = router;
