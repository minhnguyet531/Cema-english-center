import express from "express";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { User } from "../models/UserModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import {
    createPaymentUrl,
    vnpReturn,
    // vnpReturnIpn,
} from "../services/VNPayService.js";

export const buySubscription = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id).select("+password");

    if (user.role === "admin")
        return next(new ErrorHandler("Admin cannot buy subscription", 400));

    const url = await createPaymentUrl(req);

    user.subscription.id = url.orderId;
    user.subscription.status = "pending";

    const subscription = {
        id: url.orderId,
        status: "pending",
        amount: url.amount,
        url: url.vnpUrl,
    };

    await user.save();

    res.status(201).json({
        success: true,
        subscription,
    });
});

export const paymentVerification = catchAsyncError(async (req, res, next) => {
    const { code, message } = await vnpReturn(req);

    res.status(code).json({
        success: code === 97 ? false : true,
        message,
    });
});
