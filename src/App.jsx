import { useEffect, useState } from "react";
import Die from "../components/Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

export default function App() {
  // states
  const [dies, setDies] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);

  // effects
  useEffect(() => {
    const allHealed = dies.every((die) => die.isHeld);
    const firstDies = dies[0].value;
    const isSameDies = dies.every((die) => die.value === firstDies);

    setTenzies(allHealed && isSameDies);

    if (tenzies) {
      setDies(allNewDice());
    }
  }, [dies]);

  // Random number generate between 1 to 6
  function generateRandomNumber() {
    return Math.floor(Math.random() * 6 + 1);
  }

  // Generate new Die
  function generateNewDie() {
    return {
      value: generateRandomNumber(),
      isHeld: false,
      id: nanoid(),
    };
  }

  // Array of 10 dies by using generateRandomNumber() method
  function allNewDice() {
    const dies = [];
    for (let i = 1; i < 11; i++) {
      dies.push(generateNewDie());
    }
    return dies;
  }

  // Roll the dice
  function rollUnhealedDice() {
    setDies((oldDice) =>
      oldDice.map((die) => {
        return die.isHeld ? die : generateNewDie();
      })
    );
  }

  // Hold dies
  function holdDies(id) {
    setDies((prev) => {
      return prev.map((die) => ({
        ...die,
        isHeld: die.id === id ? !die.isHeld : die.isHeld,
      }));
    });
  }

  // Jsx array of all dies
  const diesJSX = dies.map((die) => (
    <Die
      value={die.value}
      isHeld={die.isHeld}
      key={die.id}
      id={die.id}
      holdDies={holdDies}
    />
  ));

  fetch("https://opentdb.com/api.php?amount=10&type=boolean")
    .then((res) => res.json())
    .then((data) => console.log(data));

  // React UI
  return (
    <main>
      {tenzies && <Confetti />}
      <h1>Tenzies</h1>
      <p className="desc">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="die-container">{diesJSX}</div>
      <button className="roll-dice" onClick={rollUnhealedDice}>
        {tenzies ? "Reset" : " Roll"}
      </button>
    </main>
  );
}
