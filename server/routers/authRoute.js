const { Router } = require("express");
const { login, logout } = require("../controllers/authController");

const {
  authenticationMiddleware,
} = require("../middleware/AuthenticationMiddleware");

const router = Router();

router.post("/login", login);

router.use(authenticationMiddleware);
router.get("/logout", logout);

module.exports = router;
