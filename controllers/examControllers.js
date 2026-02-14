const examModel = require("../models/examModel");
//create exam
const createExamController = async (req, res) => {
  try {
    const { title, description, duration, startTime, endTime } = req.body || {};
    if (!title || !description || !duration || !startTime || !endTime) {
      return res.status(401).send({
        success: false,
        message: "Please provide required fields!",
      });
    }
    if (new Date(startTime) > new Date(endTime)) {
      return res.status(401).send({
        success: false,
        message: "Start time must be before end time",
      });
    }
    const user_id = req.user.id;
    const exam = await examModel.create({
      title,
      description,
      duration,
      startTime,
      endTime,
      createdBy: user_id,
    });
    res.status(201).send({
      success: true,
      message: "Exam created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Create exam API",
      error,
    });
  }
};
module.exports = { createExamController };
