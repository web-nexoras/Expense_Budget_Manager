const express = require("express");
const router = express.Router();
const { monthlyReport, categoryReport, exportCsv, exportPdf } = require("../../controllers/report/reportControllers");
router.get("/monthly", monthlyReport);
router.get("/category", categoryReport);
router.get("/export/csv", exportCsv);
router.get("/export/pdf", exportPdf);
module.exports = router;
