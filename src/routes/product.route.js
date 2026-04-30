import { Router } from "express";
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from "../controllers/product.controller.js";
import { protect } from "../middleware/authmiddleware.js";
import { adminOnly } from "../middleware/rolemiddleware.js";
import { recommendProducts } from "../controllers/ai.controller.js";
const router = Router()

router.route('/products').get(
    protect, getProducts
)
router.route('/products/:id').get(
    protect, getProduct
)
router.route('/create-product').post(
    protect, adminOnly, createProduct
)
router.route('/update-product/:id').put(
    protect, adminOnly, updateProduct
)
router.route('/delete-product/:id').delete(
    protect, adminOnly, deleteProduct
)
router.route('/recommend').post(
    protect, recommendProducts
)
export default router;