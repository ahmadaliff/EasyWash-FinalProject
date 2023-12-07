const express = require("express");
const router = express.Router();
const authRoute = require("./authRoute");
const adminRoute = require("./adminRoute");
const {
  authenticationMiddleware,
} = require("../middleware/AuthenticationMiddleware");

router.use("/user", authRoute);

router.use(authenticationMiddleware);
router.use("/admin", adminRoute);

module.exports = router;
