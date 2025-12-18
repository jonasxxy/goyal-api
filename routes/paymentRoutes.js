const express = require("express");
const router = express.Router();
const controller = require("../controllers/paymentController");

router.get("/payments", controller.getPayments);
router.post("/payments", controller.createPayment);
router.put("/payments/:id", controller.updatePaymentStatus);

module.exports = router;
 