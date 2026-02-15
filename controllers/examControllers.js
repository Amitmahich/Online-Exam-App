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
    //exam available or not
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found!",
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

module.exports = { createExamController, addQuestionController };
