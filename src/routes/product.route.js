import { Router } from "express";
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from "../controllers/product.controller.js";

const router = Router()

router.route('/products').get(
    getProducts
)
router.route('/products/:id').get(
    getProduct
)
router.route('/create-product').post(
    createProduct
)
router.route('/update-product/:id').put(
    updateProduct
)
router.route('/delete-product/:id').delete(
    deleteProduct
)

export default router;