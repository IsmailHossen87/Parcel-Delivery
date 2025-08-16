import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { envVar } from "./env";
import { User } from "../modules/user/user.model";
import { UserRole } from "../modules/user/user.interface";
import { Strategy as LocalStrategy } from "passport-local";
import bcryptjs from "bcryptjs";
import passport from "passport";




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
passport.use(
    new LocalStrategy(
        { usernameField: "email", passwordField: "password" }, // passwordField ঠিক করতে হবে
        async (email: string, password: string, done) => {
            try {
                const userExist = await User.findOne({ email });
                if (!userExist) return done(null, false, { message: "User does not exist" });

                if (userExist.isBlocked) return done(null, false, { message: "User is Blocked" });


                // যদি ইউজার আগে Google দিয়ে লগইন করেছিলো আর এখন পাসওয়ার্ড দেয়ার চেষ্টা করে, তখন জানানো হয় Google দিয়ে লগইন করো আগে এবং পাসওয়ার্ড সেট করো।
                const isGoogleAuthenticated = userExist.auths.some(a => a.provider === "google");
                if (isGoogleAuthenticated && !userExist.password) {
                    return done(null, false, {
                        message: "You logged in with Google. Set a password first to login with email."
                    });
                }

                const isPasswordMatched = await bcryptjs.compare(password, userExist.password as string);
                if (!isPasswordMatched) return done(null, false, { message: "Password does not match" });

                return done(null, userExist);
            } catch (error) {
                console.log(error);
                done(error);
            }
        }
    )
);




// passport.use(
//     new GoogleStrategy({
//         clientID:envVar.GOOGLE_CLIENT_ID,
//         clientSecret:envVar.GOOGLE_CLIENT_SECRET,
//         callbackURL:envVar.GOOGLE_CALLBACK_URL
//     },async()=>{
//ডাটা বেসে রাখার system
//     })
// )
passport.use(
    new GoogleStrategy(
        {
            clientID: envVar.GOOGLE_CLIENT_ID,
            clientSecret: envVar.GOOGLE_CLIENT_SECRET,
            callbackURL: envVar.GOOGLE_CALLBACK_URL,
        },
        async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback
        ) => {
            try {
                const email = profile.emails?.[0].value;
                if (!email) {
                    return done(null, false, { message: "No email found" });
                }

                let isUserExist = await User.findOne({ email });

                // ইউজার আগে থেকে থাকলে
                if (isUserExist) {
                    if (isUserExist.isBlocked) {
                        return done(null, false, { message: "User is Blocked" });
                    }
                    return done(null, isUserExist); // লগইন করানো হবে
                }

                // ইউজার না থাকলে নতুন ইউজার তৈরি
                isUserExist = await User.create({
                    email,
                    name: profile.displayName,
                    picture: profile.photos?.[0].value,
                    role: UserRole.sender,
                    isBlocked: false,
                    auths: [
                        {
                            provider: "google",
                            providerId: profile.id,
                        },
                    ],
                });

                return done(null, isUserExist);
            } catch (error) {
                console.log("Google Strategy Error", error);
                return done(error);
            }
        }
    )
);




passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
    done(null, user._id)
})

passport.deserializeUser(async (id: string, done: any) => {
    try {
        const user = await User.findById(id);
        done(null, user)
    } catch (error) {
        console.log(error);
        done(error)
    }
})