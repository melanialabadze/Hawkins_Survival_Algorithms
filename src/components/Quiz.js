import quizData from "../utils/quiz_questions.json";
export const GameState = {
  START: "start",
  PLAYING: "playing",
  END: "end",
};

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getQuizElements(level) {
  const quizLevel = quizData.levels[level];
  const quizQuestionData =
    quizLevel.questions[getRandomInt(quizLevel.questions.length)];
  const quizQuestion = quizQuestionData.question;
  const quizAnswers = quizQuestionData.answerChoices;
  const quizCorrect = quizQuestionData.correctChoice;

  return {
    quizLevel: quizLevel,
    quizQuestion: quizQuestion,
    quizAnswers: quizAnswers,
    quizCorrect: quizCorrect,
  };
}

export default getQuizElements;
