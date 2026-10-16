const express = require("express");
const router = express.Router();
const { createRecurring, getRecurring, updateRecurring, deleteRecurring } = require("../../controllers/recurring/recurringControllers");
router.post("/", createRecurring);
router.get("/", getRecurring);
router.patch("/:id", updateRecurring);
router.delete("/:id", deleteRecurring);
module.exports = router;
