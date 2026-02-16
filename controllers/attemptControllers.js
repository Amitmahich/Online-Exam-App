const mongoose = require("mongoose");
const examModel = require("../models/examModel");
const attemptModel = require("../models/attemptModel");
const questionModel = require("../models/questionModel");
const autoSubmitIfExpired = require("../utils/autoSubmit");

//start-exam
const startExamController = async (req, res) => {
  try {
    const { exam_id } = req.params;
    console.log("Exam ID:", exam_id);

    if (!mongoose.Types.ObjectId.isValid(exam_id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid exam id",
      });
    }
    const exam = await examModel.findById(exam_id);
    if (!exam) {
      return res.status(404).send({
        success: false,
        message: "Exam not found!",
      });
    }
    const now = new Date();
    if (now < exam.startTime || now > exam.endTime) {
      return res.status(400).send({
        success: false,
        message: "Exam is not active",
      });
    }
    // Check karo ki student ne pehle se attempt kiya hai ya nahi
    let existingAttempt = await attemptModel.findOne({
      exam: exam_id,
      student: req.user.id,
    });

    // Agar attempt mil gaya (matlab student ne pehle exam start kiya tha)
    if (existingAttempt) {
      // Check karo kya exam ka time expire ho chuka hai
      // Agar expire ho gaya hai toh ye function:
      // - score calculate karega
      // - status "Completed" karega
      // - submittedAt set karega
      await autoSubmitIfExpired(existingAttempt, exam);

      // autoSubmitIfExpired ne DB me update kiya ho sakta hai Isliye fresh updated attempt dubara DB se la rahe hain

      existingAttempt = await attemptModel.findById(existingAttempt._id);

      // Agar auto-submit ke baad status "completed" ho gaya hai Matlab exam already khatam ho chuka hai

      if (existingAttempt.status === "completed") {
        return res.status(400).json({
          success: false,
          message: "You already completed this exam",
        });
      }

      // Agar exam abhi bhi "in-progress" hai Matlab time expire nahi hua Toh naya attempt create nahi karenge Bas existing attempt ka data return kar denge

      return res.status(200).json({
        success: true,
        message: "Exam already started",
        attemptId: existingAttempt._id,
        startedAt: existingAttempt.startedAt,
      });
    }

    //if all fine
    //correct attempt
    const attempt = await attemptModel.create({
      student: req.user.id,
      exam: exam_id,
      startedAt: now,
    });
    res.status(201).send({
      success: true,
      message: "Exam stated",
      attemptId: attempt._id,
      startedAt: attempt.startedAt,
    });
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      return res.status(400).send({
        success: false,
        message: "Duplicate attempt blocked",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error in Start test API",
      error,
    });
  }
};
//submit-exam
const submitExamController = async (req, res) => {
  try {
    const { attempt_id } = req.params;
    const { answers } = req.body;

    const attempt = await attemptModel.findById(attempt_id);
    //check attempt found or not
    if (!attempt) {
      return res.status(404).send({
        success: false,
        message: "Attempt not found",
      });
    }
    //check already submitted or not
    if (attempt.status === "completed") {
      return res.status(400).send({
        success: false,
        message: "Already submitted",
      });
    }
    const exam = await examModel.findById(attempt.exam);
    //auto-submit check
    const autoSubmitted = await autoSubmitIfExpired(attempt, exam);
    if (autoSubmitted) {
      return res.status(400).send({
        success: false,
        message: "time exceeded. Exam auto-submitted",
        score: attempt.score,
      });
    }
    const questions = await questionModel.find({ exam: exam._id });

    let score = 0;

    answers.forEach((ans) => {
      const question = questions.find(
        (q) => q._id.toString() === ans.question.toString(),
      );
      if (!question) {
        console.log("Question not found for:", ans.question);
        return; // skip
      }
      if (question && question.correctAnswer === ans.selectedOption) {
        score++;
      }
    });
    attempt.answers = answers;
    attempt.score = score;
    attempt.status = "completed";
    attempt.submittedAt = new Date();

    await attempt.save();

    res.send({
      success: true,
      message: "Exam submitted successfully!",
      result: {
        obtainedMarks: score,
        totalMarks: questions.length,
        percentage: ((score / questions.length) * 100).toFixed(2),
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Submit exam API",
    });
  }
};
module.exports = { startExamController, submitExamController };
