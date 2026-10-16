const express = require("express");
const router = express.Router();

const baseUrl = process.env.BASE_URL || "/api/v1";
const authRoutes = require("./authRoute");
const categoryRoutes = require("./categoryRoute");
const transactionRoutes = require("./transactionRoute");
const budgetRoutes = require("./budgetRoute");
const reportRoutes = require("./reportRoute");
const recurringRoutes = require("./recurringRoute");

router.use(baseUrl, authRoutes);
router.use(`${baseUrl}/categories`, categoryRoutes);
router.use(`${baseUrl}/transactions`, transactionRoutes);
router.use(`${baseUrl}/budgets`, budgetRoutes);
router.use(`${baseUrl}/reports`, reportRoutes);
router.use(`${baseUrl}/recurring`, recurringRoutes);

module.exports = router;
