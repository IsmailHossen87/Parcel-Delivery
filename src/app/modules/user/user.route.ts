import { Router } from "express";
import { userControler } from "./user.controler";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "./user.interface";

const router = Router()
router.post("/register",userControler.createUser)
router.get("/",checkAuth(...Object.values(UserRole)),userControler.getSingleUser)
// updateUser
router.patch("/",checkAuth(...Object.values(UserRole)),userControler.updateUser)

export const UserRoutes = router