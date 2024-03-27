const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
require("dotenv").config({ path: "./.env" });

const app = express();
app.use(express.json());
app.use(
  cors({
    // origin: "http://localhost:5173",
    origin: "*",
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/api/auth", require("./routes/authRouter"));

app.use(express.static(path.join(__dirname, "dist")));

app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

mongoose.connect(process.env.MONGO_URL);
mongoose.connection.once("open", () => {
  console.log("mongo connected");
  app.listen(process.env.PORT, console.log("server running"));
});
