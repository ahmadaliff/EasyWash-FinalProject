const { Router } = require("express");
const {
  getMyService,
  editService,
  addService,
  getServiceById,
  getOrders,
  getMerchant,
  editMerchant,
  editPhotoMerchant,
  changeStatus,
  changeEnableStatusService,
} = require("../controllers/laundryController");
const {
  authorizationOwnService,
  authorizationRoleLaundry,
} = require("../middleware/authorizationRole");
const { multerMiddleware } = require("../middleware/multerMiddleware");

const router = Router();

router.use(authorizationRoleLaundry);
router.get("/services", getMyService);
router.post("/service/add", addService);
router.put("/service/edit/:serviceId", authorizationOwnService, editService);
router.put(
  "/service/status/:serviceId",
  authorizationOwnService,
  changeEnableStatusService
);
router.get("/service/:serviceId", authorizationOwnService, getServiceById);
router.get("/orders", getOrders);
router.patch("/order/changeStatus", changeStatus);
router.get("/my", getMerchant);
router.put("/edit", editMerchant);
router.patch("/changePhoto", multerMiddleware, editPhotoMerchant);

module.exports = router;
