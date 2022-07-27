const express = require("express");
const router = express.Router();

const { processPayment, sendApiKey } = require("../controller/paymentController");
const { isAuthenticatedUser } = require("../middlewares/auth");

router.route("/payment/process").post(isAuthenticatedUser, processPayment);
router.route("/apikey").get(isAuthenticatedUser, sendApiKey);

module.exports = router;
