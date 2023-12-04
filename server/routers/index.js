const express = require("express");
const router = express.Router();
const authRoute = require("./authRoute");

router.use("/user", authRoute);

module.exports = router;
