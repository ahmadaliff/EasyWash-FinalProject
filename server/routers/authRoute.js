const { Router } = require("express");
const {
  login,
  logout,
  register,
  verifyEmail,
  checkOtpVerifyEmail,
} = require("../controllers/authController");

const {
  authenticationMiddleware,
} = require("../middleware/AuthenticationMiddleware");
const {
  verifyEmailMiddleware,
} = require("../middleware/verifyEmailMiddleware");

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/verifyEmail", verifyEmail);
router.post("/checkOtpVerifyEmail", verifyEmailMiddleware, checkOtpVerifyEmail);

router.use(authenticationMiddleware);
router.get("/logout", logout);

module.exports = router;
