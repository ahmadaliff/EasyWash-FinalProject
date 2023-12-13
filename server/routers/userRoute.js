const { Router } = require("express");
const {
  getAllLaundry,
  getFavorit,
  addToFavorit,
  deleteFromFavorit,
  getCart,
  addToCart,
  updateQuantity,
  deleteFromCart,
  getMyOrders,
  getMyOrderById,
  cancelOrder,
  createOrder,
} = require("../controllers/userController");
const {
  authenticationMiddleware,
} = require("../middleware/AuthenticationMiddleware");
const { authorizationRoleUser } = require("../middleware/authorizationRole");

const router = Router();

router.post("/merchant", getAllLaundry);

router.use(authenticationMiddleware);
router.use(authorizationRoleUser);

router.get("/favorit", getFavorit);
router.post("/favorit/add/:merchantId", addToFavorit);
router.delete("/favorit/delete/:merchantId", deleteFromFavorit);
router.get("/cart", getCart);
router.post("/cart/add", addToCart);
router.put("/cart/updateQuantity", updateQuantity);
router.delete("/cart/delete/:cartId", deleteFromCart);
router.get("/orders", getMyOrders);
router.post("/order/add", createOrder);
router.delete("/order/cancel/:orderId", cancelOrder);
router.get("/order/:orderId", getMyOrderById);

module.exports = router;
