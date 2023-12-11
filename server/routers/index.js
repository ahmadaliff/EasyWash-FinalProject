const express = require("express");
const router = express.Router();
const authRoute = require("./authRoute");
const adminRoute = require("./adminRoute");
const laundryRoute = require("./laundryRoute");
const userRoute = require("./userRoute");
const {
  authenticationMiddleware,
} = require("../middleware/AuthenticationMiddleware");

router.use("/auth", authRoute);
router.use("/user", userRoute);

router.use(authenticationMiddleware);

router.use("/admin", adminRoute);
router.use("/laundry", laundryRoute);

module.exports = router;
