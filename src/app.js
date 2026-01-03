import express from "express";
import cookiePaser from "cookie-parser";
import errorHandler from "./middleware/errorHandler.js";
import cors from "cors";

const app = express();

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173"],
  })
);

// webhook needs RAW body, so webhook routes MUST be mounted before express.json()
import webhookStripeRouter from "./route/stripeWebhook.router.js";

app.use("/api/v1/webhooks", webhookStripeRouter);

app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(express.json({ limit: "16kb" }));
app.use(cookiePaser());

// route start from here

import userRoute from "./route/user.router.js";
import orderRoute from "./route/order.router.js";
import tableRoute from "./route/table.router.js";
import menuRouter from "./route/menu.router.js";
import restaurantRouter from "./route/restaurant.router.js";
import paymentRouter from "./route/payment.router.js";
import paymentConfigRouter from "./route/paymentConfig.router.js";

app.use("/api/v1/users", userRoute);
app.use("/api/v1/orders", orderRoute);
app.use("/api/v1/tables", tableRoute);
app.use("/api/v1/menus", menuRouter);
app.use("/api/v1/restaurants", restaurantRouter);
app.use("/api/v1/payments", paymentRouter);
app.use("/api/v1/paymentConfig", paymentConfigRouter);

app.use(errorHandler);
export { app };
