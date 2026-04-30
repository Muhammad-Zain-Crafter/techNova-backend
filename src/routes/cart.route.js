import { Router } from "express";
import { addToCart, clearCart, decreaseQuantity, getCart } from "../controllers/cart.controller.js";
import { protect } from "../middleware/authmiddleware.js";

const router = Router();

router.route('/add').post(
    protect, addToCart
)
router.route('/').get(
    protect, getCart
)
router.route('/clear').delete(
    protect, clearCart
)
router.route('/decrease').post(
    protect, decreaseQuantity
)

export default router