const questionModel = require("../models/questionModel");

const autoSubmitIfExpired = async (attempt, exam) => {
  const now = new Date();

  const examEndTime = new Date(
    new Date(attempt.startedAt).getTime() + exam.duration * 60000,
  );
  if (now > examEndTime && attempt.status === "in-progress") {
    const questions = await questionModel.find({ exam: exam._id });

    let score = 0;
    attempt.answers.forEach((ans) => {
      const question = questions.find(
        (q) => q._id.toString() === ans.question.toString(),
      );
      if (question && question.correctAnswer === ans.selectedOption) {
        score++;
      }
    });
    attempt.score = score;
    attempt.status = "completed";
    attempt.submittedAt = examEndTime;

    await attempt.save();
    return true;
  }
  return false;
};
module.exports = autoSubmitIfExpired;
