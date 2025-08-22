"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const express_1 = require("express");
const auth_controler_1 = require("./auth.controler");
const checkAuth_1 = require("../../middleware/checkAuth");
const user_interface_1 = require("../user/user.interface");
const passport_1 = __importDefault(require("passport"));
const env_1 = require("../../config/env");
const router = (0, express_1.Router)();
router.post("/register", auth_controler_1.AuthControler.credentialsLogin);
router.get("/refresh", auth_controler_1.AuthControler.getNewAccessToken);
router.post("/logout", auth_controler_1.AuthControler.logOut);
router.post("/change-password", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.UserRole)), auth_controler_1.AuthControler.changePassword);
router.post("/set-password", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.UserRole)), auth_controler_1.AuthControler.setPassword);
// for passport    // /login -> succesful google login -> / frontend
router.get("/google", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const redirect = req.query.redirect || "/";
    passport_1.default.authenticate("google", { scope: ["profile", "email"], state: redirect })(req, res, next);
}));
// api/v1/auth/google/callback?state=/booking
router.get("/google/callback", passport_1.default.authenticate("google", { failureRedirect: `${env_1.envVar.FRONTEND_URL}/login?error=There is some issues with your account. Please contact with out support team!` }), auth_controler_1.AuthControler.googleCallbackContoller);
exports.AuthRouter = router;
