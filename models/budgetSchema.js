const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    month: { type: String, required: true, match: [/^\d{4}-(0[1-9]|1[0-2])$/, "Month must be YYYY-MM"] },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    limitAmount: { type: Number, required: true, min: 0 },
    alertThreshold: { type: Number, default: 80, min: 0, max: 100 },
  },
  { timestamps: true }
);

budgetSchema.index({ user: 1, month: 1, category: 1 });

module.exports = mongoose.model("Budget", budgetSchema);
