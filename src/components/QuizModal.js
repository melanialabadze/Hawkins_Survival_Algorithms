import QuizChoices from "./QuizChoices";

function QuizModal({ quiz, onClose, loseLife }) {
  const handleChoice = (index) => {
    if (index === quiz.quizCorrect) {
      alert("Correct!");
    } else {
      loseLife();
      alert("Wrong!");
    }
    onClose();
  };
  console.log(quiz);

  return (
    <div className="quiz-modal">
      <div>
        <h2>{quiz.quizQuestion}</h2>
        {quiz.quizAnswers.map((choice, i) => (
          <button key={i} onClick={() => handleChoice(i)}>
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuizModal;
