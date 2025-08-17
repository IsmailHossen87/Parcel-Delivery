import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "../user/user.interface";
import { adminController } from "./adminController";

const router = Router()
router.get("/users",checkAuth(UserRole.admin),adminController.getAllUsers)
router.get("/parcels",checkAuth(UserRole.admin),adminController.allPercel) 
router.patch("/parcels/status/:id",checkAuth(UserRole.admin),adminController.updateParcelStatus);


router.patch("/:id",checkAuth(UserRole.admin),adminController.updateAdmin)
// singlePercel

router.patch("/user/blocked/:id",checkAuth(UserRole.admin),adminController.blockUser)
router.patch("/user/unblocked/:id",checkAuth(UserRole.admin),adminController.unblockUser)
router.patch("/percel/blocked/:id",checkAuth(UserRole.admin),adminController.blockPercel)
router.patch("/percel/unblocked/:id",checkAuth(UserRole.admin),adminController.UnblockPercel)


export const adminRouter = router;