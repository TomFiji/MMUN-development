const express = require("express");
const router = express();
require("dotenv").config();

// Routes
const userRouter = require("./user/user.routes");
const projectRouter = require("./project/project.routes");
const reportRouter = require("./report/report.routes");
// Middlewares
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const isAuth = require("./middlewares/is-auth");
const respondHeader = require("./middlewares/respond-header");
const errorHandler = require("./middlewares/error-handler");
const notFoundHandler = require("./middlewares/not-found-handler");

router.use(helmet());
router.use(respondHeader);
router.use(cookieParser());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }))
// No Authenticate
router.use("/user", userRouter.noAuthRoutes);
// Authenticate protected
router.use(isAuth);
router.use("/report", reportRouter.router)
router.use("/user", userRouter.router);
router.use("/project", projectRouter.router);

// Error handlers
router.use("*", notFoundHandler);
router.use(errorHandler);

module.exports = router;
