const express = require("express");
const router = express.Router();
const { createBudget, getBudgets, updateBudget, deleteBudget, budgetStatus } = require("../../controllers/budget/budgetControllers");
router.post("/", createBudget);
router.get("/", getBudgets);
router.get("/status", budgetStatus);
router.patch("/:id", updateBudget);
router.delete("/:id", deleteBudget);
module.exports = router;
