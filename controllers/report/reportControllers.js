const { asyncHandler } = require("../../middlewares/asyncHandler");
const notImplemented = (req, res) => res.status(501).json({ success: false, message: "Controller not implemented yet" });

const monthlyReport = asyncHandler(async (req, res) => notImplemented(req, res));
const categoryReport = asyncHandler(async (req, res) => notImplemented(req, res));
const exportCsv = asyncHandler(async (req, res) => notImplemented(req, res));
const exportPdf = asyncHandler(async (req, res) => notImplemented(req, res));

module.exports = { monthlyReport, categoryReport, exportCsv, exportPdf };
