import "./styles.css";
import { useState } from "react";
import SplashScreen from "./components/SplashScreen.js";
import QuizQuestions from "./components/QuizQuestions.jsx";
import getQuizElements from "./components/QuizQuestions.jsx";
import GameOver from "./components/GameOver";
import { GameState } from "./components/Quiz";
import QuizModal from "./components/QuizModal";
import GameCanvas from "./GameCanvas";
import { useEffect } from "react";

export default function App() {
  const [numLives, setNumLives] = useState(3);
  const [keysCollected, setNumKeysCollected] = useState(0);
  const [gameState, setGameState] = useState(GameState.PLAYING);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [level, setLevel] = useState(1);

  const handleStart = () => {
    setGameState(GameState.PLAYING);
    setLevel(1);
  };

  useEffect(() => {
    if (numLives <= 0) {
      setGameState(GameState.END);
    }
  }, [numLives]);

  return (
    <div className="App">
      <div>
        {gameState === GameState.START && (
          <SplashScreen onStart={handleStart} />
        )}
        {gameState === GameState.PLAYING && <div>Lives: {numLives}</div>}
        {/* <button onClick={() => setActiveQuiz(getQuizElements(level))}>
          Trigger Quiz
        </button> */}
        {gameState === GameState.PLAYING && (
          <GameCanvas onTriggerQuiz={setActiveQuiz} levels={level} />
        )}
        {gameState === GameState.PLAYING && activeQuiz && (
          <QuizModal
            quiz={activeQuiz}
            onClose={() => setActiveQuiz(null)}
            loseLife={() => setNumLives((l) => l - 1)}
          />
        )}
        {gameState === GameState.END && <GameOver />}
      </div>
    </div>
  );
}
