import cors from "cors";
import express from "express";
import rateLimiter from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { connectDb } from "./common/config/database.js";
import { ENVIRONMENT } from "./common/config/environment.js";
import AppError from "./common/utils/appError.js";
import {
  catchAsync,
  handleError,
  timeoutMiddleware,
} from "./common/utils/errorHandler.js";
import { stream } from "./common/utils/logger.js";
import { setRoutes } from "./modules/routes/index.js";

/**
 * Default app configurations
 */
const app = express();
const port = ENVIRONMENT.APP.PORT;
const appName = ENVIRONMENT.APP.NAME;

// app.enable("trust proxy");

/**
 * App Security
 */
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.disable("x-powered-by");

/**
 * Limit request from same Ip
 */
const limiter = rateLimiter({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour",
  keyGenerator: function (req /*, res*/) {
    return req.headers["x-real-ip"] || req.ip;
  },
});

app.use(limiter);
app.set('trust proxy', true);

/**
 * Logger Middleware
 */
app.use(
  morgan(ENVIRONMENT.APP.ENV !== "local" ? "combined" : "dev", { stream })
);

// append request time to all request
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

/**
 * Initialize routes
 */
app.use("/api/v1", setRoutes());

// catch 404 and forward to error handler
app.all(
  "*",
  catchAsync(async (req, res) => {
    throw new AppError("route not found", 404);
  })
);

/**
 * Error handler middlewares
 */
app.use(timeoutMiddleware);
app.use(handleError);

/**
 * status check
 */
app.get("/", (req, res) => {
  res.send({
    Time: new Date(),
    status: "running",
  });
});


app.get("*", (req, res) => {
  res.send({
    Time: new Date(),
    status: "running",
  });
  // throw new NotFound();
});

/**
 * Bootstrap server
 */
app.listen(port, () => {
  console.log("=> " + appName + " app listening on port " + port + "!");
  connectDb();
});
