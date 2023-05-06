import express from "express";
import {
    buySubscription,
    paymentVerification,
} from "../controllers/paymentController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.route("/subscribe").post(isAuthenticated, buySubscription);
router.route("/vnpay_return").get(isAuthenticated, paymentVerification);

export default router;

// import {
//     buySubscription,
//     createPaymentUrl,
// } from "../controllers/paymentController";
// import { isAuthenticated } from "../middlewares/auth";

// // Buy Subcription
// router.route("/subscribe").post(isAuthenticated, buySubscription);

// router.route("/create_payment_url").post(createPaymentUrl);
