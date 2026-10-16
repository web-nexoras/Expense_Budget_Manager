const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../../middlewares/authMiddleware");
const { checkActive } = require("../../middlewares/checkActive");

const allRoutes = require("./allCategoryRoutes");
router.use("/", authMiddleware, checkActive, allRoutes);

module.exports = router;
