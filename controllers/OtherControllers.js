import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Stats } from "../models/Stats.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { sendMail } from "../utils/sendMail.js";

export const Contact = catchAsyncError(async (req, res, next) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return next(new ErrorHandler("Please fill all the feilds", 400));
  }

  const to = process.env.MY_MAIL;
  const subject = "Contact from CourseBundler";
  const text = `I am ${name} and my Email is ${email}. \n${message}`;

  await sendMail(to, subject, text);
  res.status(200).json({
    success: true,
    message: "Your message has been sent to admin",
  });
});

export const RequestCourse = catchAsyncError(async (req, res, next) => {
  const { name, email, course } = req.body;

  if (!name || !email || !course) {
    return next(new ErrorHandler("Please fill all the feilds", 400));
  }

  const to = process.env.MY_MAIL;
  const subject = "Requesting Course from CourseBundler";
  const text = `I am ${name} and my Email is ${email}. \n${course}`;

  await sendMail(to, subject, text);
  res.status(200).json({
    success: true,
    message: "Your Request has been sent to admin",
  });
});

export const GetDashStatus = catchAsyncError(async (req, res, next) => {
  const stats = await Stats.find({}).sort({ createdAt: "desc" }).limit(12);

  const statsdata = [];

  for (let i = 0; i < stats.length; i++) {
    statsdata.unshift(stats[i]);
  }

  const requiredSize = 12 - stats.length;

  for (let i = 0; i < requiredSize; i++) {
    statsdata.unshift({
      users: 0,
      subscription: 0,
      views: 0,
    });
  }

  const usersCount = statsdata[11].users;
  const subscriptionCount = statsdata[11].subscription;
  const viewsCount = statsdata[11].views;

  let usersPercentage = 0;
  let viewsPercentage = 0;
  let subscriptionPercentage = 0;

  let usersProfit = true;
  let viewsProfit = true;
  let subscriptionProfit = true;

  if (statsdata[10].users === 0) usersPercentage = usersCount * 100;
  if (statsdata[10].views === 0) viewsPercentage = viewsCount * 100;
  if (statsdata[10].subscription === 0)
    subscriptionPercentage = subscriptionCount * 100;
  else {
    const difference = {
      users: statsdata[11].users - statsdata[10].users,
      views: statsdata[11].views - statsdata[10].views,
      subscription: statsdata[11].subscription - statsdata[10].subscription,
    };
    usersPercentage = (difference.users / statsdata[10].users) * 100;
    viewsPercentage = (difference.views / statsdata[10].views) * 100;
    subscriptionPercentage =
      (difference.subscription / statsdata[10].subscription) * 100;

    if (usersPercentage < 0) {
      usersProfit = false;
    }
    if (viewsPercentage < 0) {
      viewsProfit = false;
    }
    if (subscriptionPercentage < 0) {
      subscriptionProfit = false;
    }
  }

  res.status(200).json({
    success: true,
    stats: statsdata,
    usersCount: usersCount,
    subscriptionCount: subscriptionCount,
    viewsCount: viewsCount,
    usersPercentage,
    viewsPercentage,
    subscriptionPercentage,
    usersProfit,
    viewsProfit,
    subscriptionProfit,
  });
});
