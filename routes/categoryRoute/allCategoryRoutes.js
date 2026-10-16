const express = require("express");
const router = express.Router();
const { getCategories, createCategory, updateCategory, deleteCategory, seedDefaults } = require("../../controllers/category/categoryControllers");

router.get("/", getCategories);
router.post("/", createCategory);
router.patch("/:id", updateCategory);
router.delete("/:id", deleteCategory);
router.post("/seed-defaults", seedDefaults);

module.exports = router;
