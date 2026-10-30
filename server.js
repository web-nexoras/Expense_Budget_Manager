require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const router = require("./routes");
const { errorHandler } = require("./middlewares/errorHandler");
const dbConfig = require("./configs/dbConfig");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// ---------dns 
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// Health check for deployment/interview demo
app.get("/health", (_req, res) => {
  res.status(200).json({ success: true, message: "Expense Budget Manager API is healthy" });
});

app.use(router);
app.use(errorHandler);

dbConfig();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
 