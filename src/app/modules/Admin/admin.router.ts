import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "../user/user.interface";
import { adminController } from "./adminController";

const router = Router()
router.get("/allUser",checkAuth(UserRole.admin),adminController.getAllUsers)
router.get("/allPercel",checkAuth(UserRole.admin),adminController.allPercel) 
router.patch("/:id",checkAuth(UserRole.admin),adminController.updateAdmin)
router.patch("/:id/blocked",checkAuth(UserRole.admin),adminController.blockUser)
router.patch("/:id/unblocked",checkAuth(UserRole.admin),adminController.unblockUser)


export const adminRouter = router;