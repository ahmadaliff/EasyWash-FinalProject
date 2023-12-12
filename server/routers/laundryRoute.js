const { Router } = require("express");
const {
  getMyService,
  editService,
  deleteService,
  addService,
  getServiceById,
  getOrders,
  getOrderById,
  addTotalPriceOrder,
  getMerchant,
  editMerchant,
  editPhotoMerchant,
  changeStatus,
} = require("../controllers/laundryController");
const { authorizationOwnService } = require("../middleware/authorizationRole");
const { multerMiddleware } = require("../middleware/multerMiddleware");

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
router.get("/orders", getOrders);
router.patch("/order/changeStatus", changeStatus);
router.patch("/order/totalPrice/:orderId", addTotalPriceOrder);
router.get("/my", getMerchant);
router.put("/edit", editMerchant);
router.patch("/changePhoto", multerMiddleware, editPhotoMerchant);
router.get("/order/:orderId", getOrderById);

module.exports = router;
