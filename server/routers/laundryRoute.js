const { Router } = require("express");
const {
  getMyService,
  editService,
  deleteService,
  addService,
  getServiceById,
} = require("../controllers/laundryController");
const { authorizationOwnService } = require("../middleware/authorizationRole");

const router = Router();

router.get("/services", getMyService);
router.post("/service/add", addService);
router.put("/service/edit/:serviceId", authorizationOwnService, editService);
router.delete(
  "/service/delete/:serviceId",
  authorizationOwnService,
  deleteService
);
router.get("/service/:serviceId", authorizationOwnService, getServiceById);

module.exports = router;
