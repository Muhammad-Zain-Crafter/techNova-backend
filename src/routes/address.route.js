import { Router } from 'express';
import { addAddress, deleteAddress, getAddress } from '../controllers/address.controller.js';
import { protect } from "../middleware/authmiddleware.js";

const router = Router();

router.route('/').post(
    protect, addAddress
)
router.route('/').get(
    protect, addAddress
)
router.route('/:id').delete(
    protect, deleteAddress
)

export default router;