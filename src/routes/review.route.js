import Router from "express";
import { createReview, editReview, deleteReview, getReviewsByProduct } from "../controllers/review.controller.js";
import { protect } from "../middleware/authmiddleware.js";

const router = Router()

router.route("/create-review").post(
    protect, createReview
)
router.route("/edit-review/:reviewId").put(
    protect, editReview
)
router.route("/delete-review/:reviewId").delete(
    protect, deleteReview
)
router.route("/:productId").get(
    getReviewsByProduct
)

export default router