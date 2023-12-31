const { Router } = require("express");
const {
  token,
  createChannels,
  deleteChannel,
} = require("../controllers/messageController");
const { authorizationRoleLaundry } = require("../middleware/authorizationRole");

const router = Router();

router.get("/token", token);
router.post("/createChannel", createChannels);
router.use(authorizationRoleLaundry);
router.delete("/delete/:userId", deleteChannel);

module.exports = router;
