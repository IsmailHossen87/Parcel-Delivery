import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "../user/user.interface";
import { adminController } from "./adminController";

const router = Router()
router.get("/allUser",checkAuth(UserRole.admin),adminController.getAllUsers)
router.patch("/:id",checkAuth(UserRole.admin),adminController.updateAdmin)


export const adminRouter = router;