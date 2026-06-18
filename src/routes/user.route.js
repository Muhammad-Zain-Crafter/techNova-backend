import { registerUser, loginUser, getDashboardStats } from "../controllers/user.controller.js";
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

router.route('/getDashboardStats').get(
    protect, adminOnly, getDashboardStats
)
export default router;