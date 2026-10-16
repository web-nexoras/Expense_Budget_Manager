const { asyncHandler } = require("../../middlewares/asyncHandler");
const notImplemented = (req, res) => res.status(501).json({ success: false, message: "Controller not implemented yet" });

const createTransaction = asyncHandler(async (req, res) => notImplemented(req, res));
const getAllTransactions = asyncHandler(async (req, res) => notImplemented(req, res));
const getTransaction = asyncHandler(async (req, res) => notImplemented(req, res));
const updateTransaction = asyncHandler(async (req, res) => notImplemented(req, res));
const deleteTransaction = asyncHandler(async (req, res) => notImplemented(req, res));
const transactionSummary = asyncHandler(async (req, res) => notImplemented(req, res));

module.exports = { createTransaction, getAllTransactions, getTransaction, updateTransaction, deleteTransaction, transactionSummary };
