import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "../user/user.interface";
import { adminController } from "./adminController";

const router = Router()
router.get("/users",checkAuth(UserRole.admin),adminController.getAllUsers)
router.get("/parcels",checkAuth(UserRole.admin),adminController.allPercel) 
// PATCH/POST /admin/parcels/:id/status → স্ট্যাটাস আপডেট (লগ লিখবে)
// PATCH/POST /admin/parcels/:id/block → পার্সেল ব্লক/আনব্লক
router.patch("/:id",checkAuth(UserRole.admin),adminController.updateAdmin)
router.patch("/:id/blocked",checkAuth(UserRole.admin),adminController.blockUser)
router.patch("/:id/unblocked",checkAuth(UserRole.admin),adminController.unblockUser)


export const adminRouter = router;