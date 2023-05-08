import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendEmail } from "../utils/sendEmail.js";
import { Stats } from "../models/StatsModel.js";

export const contact = catchAsyncError(async (req, res, next) => {
    const { email, name, message } = req.body;

    if (!email || !name || !message)
        return next(new ErrorHandler("Please fill all the fields", 400));

    const to = process.env.MY_MAIL;
    const subject = `Contact Form - Cema English Center`;

    const text = `I am ${name} and my email is ${email}. ${message}`;

    await sendEmail(to, subject, text);

    res.status(200).json({
        success: true,
        message: "Your message has been sent successfully",
    });
});

export const courseRequest = catchAsyncError(async (req, res, next) => {
    const { email, name, course } = req.body;
    if (!email || !name || !course)
        return next(new ErrorHandler("Please fill all the fields", 400));

    const to = process.env.MY_MAIL;
    const subject = `Requesting for a course on - ${process.env.APP_NAME}`;

    const text = `I am ${name} and my email is ${email}. ${course}`;

    await sendEmail(to, subject, text);

    res.status(200).json({
        success: true,
        message: "Your request has been sent successfully",
    });
});

export const getDashboardStats = catchAsyncError(async (req, res, next) => {
    const stats = await Stats.find({}).sort({ createdAt: "desc" }).limit(12);

    const statsData = [];
    for (let i = 0; i < stats.length; i++) {
        statsData.unshift(stats[i]);
    }
    const requiredSize = 12 - stats.length;

    for (let i = 0; i < requiredSize; i++) {
        statsData.unshift({
            users: 0,
            subscription: 0,
            views: 0,
        });
    }

    const usersCount = statsData[11].users;
    const subscriptionCount = statsData[11].subscription;
    const viewsCount = statsData[11].views;

    let usersPercentage = 0,
        viewsPercentage = 0,
        subscriptionPercentage = 0;

    let usersProfit = true,
        viewsProfit = true,
        subscriptionProfit = true;

    if (statsData[10].users === 0) usersPercentage = usersCount * 100;
    if (statsData[10].views === 0) viewsPercentage = viewsCount * 100;
    if (statsData[10].subscription === 0)
        subscriptionPercentage = subscriptionCount * 100;
    else {
        const difference = {
            users: statsData[11].users - statsData[10].users,
            views: statsData[11].views - statsData[10].views,
            subscription: statsData[11].users - statsData[10].subscription,
        };

        usersPercentage = (difference.users / statsData[10].users) * 100;
        viewsPercentage = (difference.views / statsData[10].views) * 100;
        subscriptionPercentage =
            (difference.subscription / statsData[10].subscription) * 100;

        if (usersPercentage < 0) usersProfit = false;
        if (viewsPercentage < 0) viewsProfit = false;
        if (subscriptionPercentage < 0) subscriptionProfit = false;
    }

    await res.status(200).json({
        success: true,
        stats: statsData,
        usersCount,
        subscriptionCount,
        viewsCount,
        subscriptionPercentage,
        viewsPercentage,
        usersPercentage,
        subscriptionProfit,
        viewsProfit,
        usersProfit,
    });
});
