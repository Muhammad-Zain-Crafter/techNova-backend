import { createOrder, cancelOrder, getMyOrders, getAllOrders, updateOrderStatus } from "../controllers/order.controller.js";
import { Router } from "express";
import { protect } from "../middleware/authmiddleware.js";
import { adminOnly } from "../middleware/rolemiddleware.js";

const router = Router()

router.route('/create-order').post(
    protect, createOrder
)
router.route('/cancel-order/:id').post(
    protect, cancelOrder
)
router.route('/getOrder').get(
    protect, getMyOrders
)
router.route('/getAllOrders').get(
    protect, adminOnly, getAllOrders
)
router.route('/update-order-status/:id').put(
    protect, adminOnly, updateOrderStatus
)
export default router