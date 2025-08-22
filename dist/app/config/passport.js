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
/* eslint-disable @typescript-eslint/no-explicit-any */
const passport_google_oauth20_1 = require("passport-google-oauth20");
const env_1 = require("./env");
const user_model_1 = require("../modules/user/user.model");
const user_interface_1 = require("../modules/user/user.interface");
const passport_local_1 = require("passport-local");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const passport_1 = __importDefault(require("passport"));
// passport.use(
//     new LocalStrategy({
//         usernameField :"email",
//          passwordField: "email"
//     }, async (email: string, password: string, done) => {
//         try {
//         } catch (error) {
//             console.log("Google Strategy Error", error);
//             return done(error)
//         }
//     })
// )
// Local Strategy
passport_1.default.use(new passport_local_1.Strategy({ usernameField: "email", passwordField: "password" }, // passwordField ঠিক করতে হবে
(email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userExist = yield user_model_1.User.findOne({ email });
        if (!userExist)
            return done(null, false, { message: "User does not exist" });
        if (userExist.isBlocked)
            return done(null, false, { message: "User is Blocked" });
        // যদি ইউজার আগে Google দিয়ে লগইন করেছিলো আর এখন পাসওয়ার্ড দেয়ার চেষ্টা করে, তখন জানানো হয় Google দিয়ে লগইন করো আগে এবং পাসওয়ার্ড সেট করো।
        const isGoogleAuthenticated = userExist.auths.some(a => a.provider === "google");
        if (isGoogleAuthenticated && !userExist.password) {
            return done(null, false, {
                message: "You logged in with Google. Set a password first to login with email."
            });
        }
        const isPasswordMatched = yield bcryptjs_1.default.compare(password, userExist.password);
        if (!isPasswordMatched)
            return done(null, false, { message: "Password does not match" });
        return done(null, userExist);
    }
    catch (error) {
        console.log(error);
        done(error);
    }
})));
// passport.use(
//     new GoogleStrategy({
//         clientID:envVar.GOOGLE_CLIENT_ID,
//         clientSecret:envVar.GOOGLE_CLIENT_SECRET,
//         callbackURL:envVar.GOOGLE_CALLBACK_URL
//     },async()=>{
//ডাটা বেসে রাখার system
//     })
// )
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: env_1.envVar.GOOGLE_CLIENT_ID,
    clientSecret: env_1.envVar.GOOGLE_CLIENT_SECRET,
    callbackURL: env_1.envVar.GOOGLE_CALLBACK_URL,
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const email = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value;
        if (!email) {
            return done(null, false, { message: "No email found" });
        }
        let isUserExist = yield user_model_1.User.findOne({ email });
        // ইউজার আগে থেকে থাকলে
        if (isUserExist) {
            if (isUserExist.isBlocked) {
                return done(null, false, { message: "User is Blocked" });
            }
            return done(null, isUserExist); // লগইন করানো হবে
        }
        // ইউজার না থাকলে নতুন ইউজার তৈরি
        isUserExist = yield user_model_1.User.create({
            email,
            name: profile.displayName,
            picture: (_b = profile.photos) === null || _b === void 0 ? void 0 : _b[0].value,
            role: user_interface_1.UserRole.sender,
            isBlocked: false,
            auths: [
                {
                    provider: "google",
                    providerId: profile.id,
                },
            ],
        });
        return done(null, isUserExist);
    }
    catch (error) {
        console.log("Google Strategy Error", error);
        return done(error);
    }
})));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(id);
        done(null, user);
    }
    catch (error) {
        console.log(error);
        done(error);
    }
}));
