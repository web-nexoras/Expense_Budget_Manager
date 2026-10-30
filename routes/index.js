const express = require("express");
const router = express.Router();

const baseUrl = process.env.BASE_URL || "/api/v1";
const auth = require("./auth/auth_routes");


router.use(baseUrl, auth);


module.exports = router;
