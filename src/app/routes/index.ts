import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRouter } from "../modules/auth/auth.route";
import { adminRouter } from "../modules/Admin/admin.router";
import { parcelRouter } from "../modules/parcel/parcel.router";

export const router =Router()

const moduleRoutes =[
    {path:"/user",route:UserRoutes},
    {path:"/parcel",route:parcelRouter},
    {path:"/auth",route:AuthRouter},
    {path:"/admin",route:adminRouter},
]

moduleRoutes.forEach((route)=>{
    router.use(route.path,route.route)
})