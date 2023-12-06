const { Router } = require("express");
const {
  getUsers,
  getUnverifiedUsers,
  deleteUser,
} = require("../controllers/adminController");
const { authorizationRoleAdmin } = require("../middleware/authorizationRole");

const router = Router();

router.use(authorizationRoleAdmin);
router.get("/users", getUsers);
router.get("/users/unverified", getUnverifiedUsers);
router.delete("/user/delete", deleteUser);

module.exports = router;
