const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDb = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const examRoutes = require("./routes/examRoutes");

//dotenv configuration
dotenv.config();

//DB connection
connectDb();

//server creation
const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/exam", examRoutes);

//routing kri hai for checking
app.get("/", (req, res) => {
  res.send("<h1>API is Running BRO!</h1>");
});

//define port
const PORT = process.env.PORT || 8080;

//app listening
app.listen(PORT, (req, res) => {
  console.log(`Online Exam app is running on PORT ${PORT}`);
});
