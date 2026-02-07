// QuizChoices.js
function QuizChoices({ choices, onChoice }) {
  return (
    <div className="quiz-choices">
      {choices.map((choice, index) => (
        <button key={index} onClick={() => onChoice(index)}>
          {choice}
        </button>
      ))}
    </div>
  );
}

export default QuizChoices;
