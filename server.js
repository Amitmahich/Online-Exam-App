const express = require("express");
const app = express();

app.use(express.json());
const PORT = 8080;

app.get("/", (req, res) => {
  res.send("API is Running BRO!");
});

app.listen(PORT, (req, res) => {
  console.log(`Online Exam app is running on PORT ${PORT}`);
});
