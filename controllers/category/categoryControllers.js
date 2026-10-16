const { asyncHandler } = require("../../middlewares/asyncHandler");
const notImplemented = (req, res) => res.status(501).json({ success: false, message: "Controller not implemented yet" });

const getCategories = asyncHandler(async (req, res) => notImplemented(req, res));
const createCategory = asyncHandler(async (req, res) => notImplemented(req, res));
const updateCategory = asyncHandler(async (req, res) => notImplemented(req, res));
const deleteCategory = asyncHandler(async (req, res) => notImplemented(req, res));
const seedDefaults = asyncHandler(async (req, res) => notImplemented(req, res));

module.exports = { getCategories, createCategory, updateCategory, deleteCategory, seedDefaults };
