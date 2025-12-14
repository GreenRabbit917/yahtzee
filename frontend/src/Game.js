import "./Game.css";
import Dice from "./Dice";
import ScoreCard from "./Scorecard";

import { useEffect, useState } from "react";
import { deepClone } from "./utilities";
import RollButton from "./RollButton";

const INITIAL_ROLL_COUNT = 3;

function getInitialScoreCard() {
  return {
    ones: undefined,
    twos: undefined,
    threes: undefined,
    fours: undefined,
    fives: undefined,
    sixes: undefined,
    yahtzee: undefined,
    totalScore: 0,
  };
}

function getRandomValue() {
  return Math.floor(Math.random() * 6) + 1;
}

function rollAllDice() {
  return Array.from({ length: 5 }, () => {
    return { value: getRandomValue(), isPressed: false };
  });
}

function Game() {
  const [allDice, setAllDice] = useState(rollAllDice());
  const [rollCount, setRollCount] = useState(INITIAL_ROLL_COUNT);
  const [scoreCard, setScoreCard] = useState(getInitialScoreCard());
  const [games, setGames] = useState([]);
  const [isLoadingGames, setIsLoadingGames] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      setIsLoadingGames(true);
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/games`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setGames(data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoadingGames(false);
      }
    };
    fetchGames();
  }, []);

  function diceClickCallback(index) {
    let newDice = deepClone(allDice);
    newDice[index].isPressed = !newDice[index].isPressed;

    setAllDice(newDice);
  }

  function rollNonPressedDice() {
    setRollCount(rollCount - 1);
    console.log(rollCount);
    let newDice = deepClone(allDice);
    for (let i = 0; i < newDice.length; i++) {
      if (newDice[i].isPressed) {
        newDice[i].value = allDice[i].value;
      } else {
        newDice[i].value = getRandomValue();
      }
    }
    setAllDice(newDice);
  }

  function updateScoreCard(newScoreCard) {
    setScoreCard(newScoreCard);
    setAllDice(rollAllDice);
    setRollCount(INITIAL_ROLL_COUNT);
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="games-list">
          <h2>Games</h2>
          {isLoadingGames && <p>Loading games...</p>}
          {!isLoadingGames && games.length === 0 && <p>No games available</p>}
          {!isLoadingGames && games.length > 0 && (
            <div>
              {games.map((game) => (
                <div key={game.id}>
                  Game #{game.id} — created at {game.created_at}
                </div>
              ))}
            </div>
          )}
        </div>
        <RollButton
          onClick={rollNonPressedDice}
          isDisabled={rollCount <= 0}
        ></RollButton>
        <div className={"roll-count-message"}>
          you have {rollCount} rolls left! <br />
          {rollCount === 0 ? "you must click score card" : ""}
        </div>
        <div>
          {allDice.map((item, index) => (
            <Dice
              value={item.value}
              key={index}
              onClick={() => diceClickCallback(index)}
              isPressed={item.isPressed}
            ></Dice>
          ))}
        </div>
        <ScoreCard
          allDice={allDice}
          scoreCard={scoreCard}
          handleScoreCardUpdate={updateScoreCard}
        ></ScoreCard>
      </header>
    </div>
  );
}

export default Game;
