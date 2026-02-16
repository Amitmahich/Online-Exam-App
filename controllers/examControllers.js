const mongoose = require("mongoose");
const examModel = require("../models/examModel");
const questionModel = require("../models/questionModel");
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
    //finding logged in user
    const user_id = req.user.id;

    //for remove duplication
    const existingExam = await examModel.findOne({
      title: title.trim(),
      startTime: startTime,
      endTime: endTime,
      createdBy: user_id,
    });
    if (existingExam) {
      return res.status(400).send({
        success: false,
        message: "Exam already exists with same title and same user",
      });
    }

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
      exam,
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
//add question
const addQuestionController = async (req, res) => {
  try {
    const { exam_id } = req.params;
    const { questionText, options, correctAnswer } = req.body || {};

    // validation
    if (
      !questionText ||
      !Array.isArray(options) ||
      correctAnswer === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields!",
      });
    }

    if (options.length !== 4) {
      return res.status(400).json({
        success: false,
        message: "Question must have exactly 4 options",
      });
    }

    if (correctAnswer < 0 || correctAnswer > 3) {
      return res.status(400).json({
        success: false,
        message: "Correct answer index must be between 0 and 3",
      });
    }

    const exam = await examModel.findById(exam_id);

    //Validate exam_id format
    if (!mongoose.Types.ObjectId.isValid(exam_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid exam ID",
      });
    }

    //exam available or not
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found!",
      });
    }
    //for remove duplicate
    const existingQuestion = await questionModel.findOne({
      exam: exam_id,
      questionText,
    });

    if (existingQuestion) {
      return res.status(400).send({
        success: false,
        message: "Question already exists in this exam",
      });
    }
    //adding questions
    const question = await questionModel.create({
      exam: exam_id,
      questionText,
      options,
      correctAnswer,
    });

    return res.status(201).json({
      success: true,
      message: "Question added successfully!",
      question,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error in Add Question API",
    });
  }
};
//get-exam
const getExamController = async (req, res) => {
  try {
    const { exam_id } = req.params;
    const exam = await examModel.findById(exam_id);
    if (!exam) {
      return res.status(404).send({
        success: false,
        message: "Exam not found!",
      });
    }
    const now = new Date();
    if (now < exam.startTime || now > exam.endTime) {
      return res.status(403).send({
        success: false,
        message: "Exam is not active!",
      });
    }
    const questions = await questionModel
      .find({ exam: exam_id })
      .select("-correctAnswer");
    res.send({
      exam: {
        _id: exam._id,
        title: exam.title,
        description: exam.description,
        duration: exam.duration,
        startTime: exam.startTime,
        endTime: exam.endTime,
      },
      questions,
    });
  } catch (error) {
    (console.log(error),
      res.status(500).send({
        success: false,
        message: "Error in Get exam API",
        error,
      }));
  }
};

module.exports = {
  createExamController,
  addQuestionController,
  getExamController,
};
