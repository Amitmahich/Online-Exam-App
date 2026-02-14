const mongoose = require("mongoose");

const connectDb = async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URL); //main line

    console.log(`Connected to database ${mongoose.connection.host}`);
  } catch (error) {
    console.log("Database error ", error);
  }
};
module.exports = connectDb;
