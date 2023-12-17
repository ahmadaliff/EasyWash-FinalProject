const { Router } = require("express");
const {
  login,
  logout,
  register,
  verifyEmail,
  checkOtpVerifyEmail,
  forgotPassword,
  setResetPassword,
  refreshToken,
  getProfile,
  editPhotoProfile,
  editProfile,
  redirectGoogle,
  handleLoginGoogle,
} = require("../controllers/authController");

const {
  authenticationMiddleware,
} = require("../middleware/AuthenticationMiddleware");
const {
  verifyEmailMiddleware,
} = require("../middleware/verifyEmailMiddleware");
const {
  verifySendResetMiddleware,
} = require("../middleware/sendResetPassMiddleware");
const { multerMiddleware } = require("../middleware/multerMiddleware");

const router = Router();

router.post("/login", login);
router.get("/google", redirectGoogle);
router.post("/google/data", handleLoginGoogle);
router.post("/register", register);
router.post("/verifyEmail", verifyEmail);
router.post("/checkOtpVerifyEmail", verifyEmailMiddleware, checkOtpVerifyEmail);
router.post("/forgotPassword", forgotPassword);
router.put("/resetPassword", verifySendResetMiddleware, setResetPassword);
router.get("/refresh", refreshToken);
router.post("/logout", logout);

router.use(authenticationMiddleware);
router.get("/profile", getProfile);
router.put("/edit/photoProfile", multerMiddleware, editPhotoProfile);
router.put("/edit/profile", editProfile);

module.exports = router;
