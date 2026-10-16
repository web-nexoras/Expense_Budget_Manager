const { asyncHandler } = require("../../middlewares/asyncHandler");
const notImplemented = (req, res) => res.status(501).json({ success: false, message: "Controller not implemented yet" });

const createBudget = asyncHandler(async (req, res) => notImplemented(req, res));
const getBudgets = asyncHandler(async (req, res) => notImplemented(req, res));
const updateBudget = asyncHandler(async (req, res) => notImplemented(req, res));
const deleteBudget = asyncHandler(async (req, res) => notImplemented(req, res));
const budgetStatus = asyncHandler(async (req, res) => notImplemented(req, res));

module.exports = { createBudget, getBudgets, updateBudget, deleteBudget, budgetStatus };
