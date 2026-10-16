const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../../middlewares/authMiddleware");
const { checkActive } = require("../../middlewares/checkActive");
const all = require("./allBudgetRoutes");
router.use("/", authMiddleware, checkActive, all);
module.exports = router;
