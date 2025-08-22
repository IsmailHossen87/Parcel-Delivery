"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const user_controler_1 = require("./user.controler");
const checkAuth_1 = require("../../middleware/checkAuth");
const user_interface_1 = require("./user.interface");
const router = (0, express_1.Router)();
router.post("/register", user_controler_1.userControler.createUser);
router.get("/", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.UserRole)), user_controler_1.userControler.getSingleUser);
// updateUser
router.patch("/", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.UserRole)), user_controler_1.userControler.updateUser);
exports.UserRoutes = router;
