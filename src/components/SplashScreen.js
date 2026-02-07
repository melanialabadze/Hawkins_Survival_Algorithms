import { useState } from "react";
import quizData from "../utils/quiz_questions.json";
// import { getQuizElements } from "./components/Quiz.js";
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
function handleClick(level) {
  console.log(getQuizElements(level).quizQuestion);
}

function SplashScreen() {
  return (
    <div>
      <h1> Hawkin's Survival Algorithms</h1>
      <h2> Can you survive? </h2>
      <button onClick={handleClick(0)}>Play</button>
    </div>
  );
}
export default SplashScreen;
