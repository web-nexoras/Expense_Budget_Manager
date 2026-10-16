const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    amount: { type: Number, required: true, min: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    date: { type: Date, required: true },
    paymentMethod: {
      type: String,
      enum: ["cash", "bkash", "nagad", "bank", "card"],
      default: "cash",
    },
    notes: { type: String, trim: true, maxlength: 300 },
    tags: [{ type: String, trim: true }],
    receiptUrl: { type: String, trim: true },
  },
  { timestamps: true }
);

transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, type: 1 });
transactionSchema.index({ user: 1, category: 1 });

module.exports = mongoose.model("Transaction", transactionSchema);
