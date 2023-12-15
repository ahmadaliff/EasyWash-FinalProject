const { Router } = require("express");
const {
  token,
  createChannels,
  deleteChannel,
} = require("../controllers/messageController");
const { authorizationRoleLaundry } = require("../middleware/authorizationRole");

const router = Router();

router.post("/token", token);
router.post("/createChannel", createChannels);
router.use(authorizationRoleLaundry);
router.delete("/delete/:userid", deleteChannel);

module.exports = router;
