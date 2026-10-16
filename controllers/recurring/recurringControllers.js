const { asyncHandler } = require("../../middlewares/asyncHandler");
const notImplemented = (req, res) => res.status(501).json({ success: false, message: "Controller not implemented yet" });

const createRecurring = asyncHandler(async (req, res) => notImplemented(req, res));
const getRecurring = asyncHandler(async (req, res) => notImplemented(req, res));
const updateRecurring = asyncHandler(async (req, res) => notImplemented(req, res));
const deleteRecurring = asyncHandler(async (req, res) => notImplemented(req, res));

module.exports = { createRecurring, getRecurring, updateRecurring, deleteRecurring };
