const express = require("express");
const router = express.Router();
const authAllRoutes = require("./authAllRoutes");
router.use("/auth", authAllRoutes);
module.exports = router;
