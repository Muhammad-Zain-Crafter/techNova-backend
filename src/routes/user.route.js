import { registerUser, loginUser, getDashboardStats, changePassword, updateDetails, getAllUsers, getProfile } from "../controllers/user.controller.js";
import { Router } from "express";
import { adminOnly } from "../middleware/rolemiddleware.js";
import { protect } from "../middleware/authmiddleware.js";

const router = Router()

router.route('/register').post(
    registerUser
)

router.route('/login').post(
    loginUser
)

router.route('/getProfile').get(
    protect, getProfile
)

router.route('/getDashboardStats').get(
    protect, adminOnly, getDashboardStats
)

router.route('/getAllUsers').get(
    protect, adminOnly, getAllUsers
)

router.route('/updateDetails').put(
    protect, updateDetails
)

router.route('/changePassword').put(
    protect, changePassword
)

export default router;