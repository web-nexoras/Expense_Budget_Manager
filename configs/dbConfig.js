const mongoose = require("mongoose");

const dbConfig = async () => {
  await mongoose.connect(process.env.MONGO_URL || process.env.DB_URL);
  console.log("Database connected successfully");
};

module.exports = dbConfig;
