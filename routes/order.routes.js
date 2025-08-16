const express = require("express");
const orderController = require("../controllers/order.controller");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

router.route("/create").post(orderController.createOrder);
router.route("/:id").get(orderController.getOrderbyId);
router.route("/").get(verifyToken, orderController.getAllOrders); //admin only

module.exports = router;
